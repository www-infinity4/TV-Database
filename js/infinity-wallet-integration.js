/* StarQuest → authoritative Cloudflare Unified Wallet account view.
 * The Mint-for-Infinity browser wallet is legacy/local-only and is never a
 * substitute for the Cloudflare wallet shared across QuantaPhi.org apps.
 */
(function () {
  'use strict';
  const STAR = 'https://starquest-ledger.marvaseater.workers.dev/v1/state';
  const UNIFIED = 'https://unified-wallet.marvaseater.workers.dev/v1/wallet/state';
  const RECOVERY_URL = 'https://quantaphi.org/wallet-recovery.html?verify=1&returnTo=%2FTV-Database%2F';
  const VERIFIED_URL = 'https://quantaphi.org/wallet-recovery.html?returnTo=%2FTV-Database%2F';
  const button = document.getElementById('unified-wallet-connect');
  const buttonLabel = document.getElementById('unified-wallet-label');
  const buttonDetail = document.getElementById('unified-wallet-detail');
  const status = document.getElementById('unified-wallet-status');
  const cloudBalances = document.getElementById('cloud-unified-wallet-balances');
  // Keep local rights records only as a non-authoritative legacy audit trail.
  // Never import them or derive a Cloudflare token balance from browser storage.
  const wallet = window.InfinityUnifiedWallet ? new window.InfinityUnifiedWallet.UnifiedInfinityWallet() : null;
  const slug = value => String(value || 'unresolved').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'unresolved';
  let cloudState = null, loading = null, lastError = '';
  function currentLocal() { return wallet?.state?.wallets?.[wallet.state.currentWalletId] || null; }
  function setStatus(message) { if (status) status.textContent = message; }
  function format(n) { return Number.isFinite(Number(n)) ? Number(n).toLocaleString(undefined,{maximumFractionDigits:1}) : 'Unavailable'; }
  function render() {
    const verified = !!cloudState;
    if (buttonLabel) buttonLabel.textContent = verified ? 'Unified Wallet · Cloudflare verified' : 'Find / Restore Unified Wallet';
    if (buttonDetail) buttonDetail.textContent = verified
      ? 'StarCoins, Quants, Infinity, Music Quants · one verified account'
      : 'Verify your existing Cloudflare wallet';
    if (button) button.classList.toggle('connected',verified);
    if (cloudBalances) {
      cloudBalances.replaceChildren();
      cloudBalances.hidden = !verified;
      if (verified) {
        for (const [asset,label] of [['STARCOIN','StarCoins'],['QUANT','Quants'],['INFINITY','Infinity'],['MUSIC_QUANT','Music Quants']]) {
          const item = document.createElement('span');
          const labelElement = document.createElement('small');
          const value = document.createElement('strong');
          labelElement.textContent = label;
          value.textContent = format(cloudState.balances[asset]);
          item.append(labelElement,value);
          cloudBalances.appendChild(item);
        }
      }
    }
    setStatus(verified
      ? 'Live Cloudflare wallet verified for ' + cloudState.username + '. Balances are read-only; local browser values are not imported.'
      : lastError || 'Cloudflare wallet not verified. Recover the existing account; do not create a new wallet.');
  }
  async function request(url,token) {
    const response = await fetch(url,{
      method:'GET',cache:'no-store',
      headers:{Authorization:'Bearer '+token},
      signal:AbortSignal.timeout(12000)
    });
    const payload = await response.json().catch(()=>({}));
    if (!response.ok || payload.ok !== true) throw Error(payload.error || 'cloud_wallet_unavailable');
    return payload;
  }
  async function readCloud() {
    const bridge = window.QuantaCloudConnection;
    if (bridge?.ready) await bridge.ready;
    const token = await bridge?.resolveDeviceToken?.();
    if (!/^sq_[A-Za-z0-9_-]{32,}$/.test(token || '')) throw Error('Cloudflare device connection missing. Use wallet recovery.');
    const [star,unified] = await Promise.all([request(STAR,token),request(UNIFIED,token)]);
    const starName = String(star.state?.username || '').trim().toLowerCase();
    const unifiedName = String(unified.user?.username || '').trim().toLowerCase();
    if (!starName || starName !== unifiedName || !unified.user?.id) throw Error('Cloud wallet identity mismatch. No records changed.');
    const localUser = window.StarQuestAuth?.currentUser?.();
    if (localUser && String(localUser.key || localUser.username || '').trim().toLowerCase() !== starName)
      throw Error('Different StarQuest account selected. Use verified account recovery.');
    const balances=unified.balances;
    if (!balances || !['STARCOIN','QUANT','INFINITY','MUSIC_QUANT'].every(asset=>Number.isFinite(Number(balances[asset]))))
      throw Error('The unified wallet returned an incomplete balance report.');
    return {username:starName,balances,accountId:unified.user.id};
  }
  function refreshCloud() {
    if (loading) return loading;
    loading = (async () => {
      try {
        const state = await readCloud();
        cloudState = state;lastError = '';
      } catch (error) {
        cloudState = null;
        lastError = 'Cloudflare verification needed: ' + String(error.message || error).slice(0,125);
      } finally {
        render();
      }
    })().finally(()=>{loading=null});
    return loading;
  }
  if (button) button.addEventListener('click', function () {
    location.href = cloudState ? VERIFIED_URL : RECOVERY_URL;
  });
  document.addEventListener('starquest:content-unlocked', async function (event) {
    const connected = currentLocal();
    const detail = event.detail || {};
    const unlock = detail.unlock || {};
    if (!cloudState || !connected || detail.alreadyUnlocked || !unlock.cost) return;
    const rights = unlock.rights || {};
    const companyName = String(rights.companyName || unlock.title + ' rights company — unresolved');
    const companyId = 'company:' + slug(rights.companyId || companyName);
    const companyWalletId = 'provisional:' + companyId;
    wallet.createProvisionalWallet({ walletId: companyWalletId, displayName: companyName });
    const people = Array.isArray(rights.creditedPeople) && rights.creditedPeople.filter(Boolean).length
      ? rights.creditedPeople.filter(Boolean) : ['Credited people reserve — unresolved'];
    const participants = [{ id: companyId, name: companyName, beneficiaryClass: 'COMPANY', units: 1000, claimStatus: 'UNCLAIMED' }]
      .concat(people.map(name => ({ id: 'person:' + slug(name), name: String(name), beneficiaryClass: 'PERSON', units: 100, claimStatus: 'UNCLAIMED' })));
    const sourceId = String(unlock.ledgerEventId || ('unlock:' + unlock.contentId + ':' + unlock.unlockedAt));
    try {
      await wallet.recordNormalExchange({ eventId: 'starquest:royalty:' + sourceId, walletId: connected.walletId,
        sourceSystem: 'STARQUEST', sourceEventId: sourceId, exchangeKind: 'MEDIA_UNLOCK', contentTokenId: unlock.contentId,
        consideration: { assetCode: 'STAR_COIN', amount: unlock.cost }, participants, timestamp: new Date(unlock.unlockedAt).toISOString() });
      await wallet.receiveStarCoin({ eventId: 'starquest:blank-token:' + sourceId, fromWalletId: connected.walletId,
        toWalletId: companyWalletId, sourceSystem: 'STARQUEST', sourceEventId: sourceId, sourceContentId: unlock.contentId,
        timestamp: new Date(unlock.unlockedAt).toISOString() });
      setStatus('Local rights record created. Cloudflare settlement remains unverified; no extra StarCoins or Infinity tokens were added.');
    } catch (error) { setStatus('Local rights record pending verification. Cloudflare wallet records were not changed: ' + error.message); }
  });

  document.addEventListener('starquest:ledger-connected',()=>void refreshCloud());
  document.addEventListener('starquest:auth-changed',()=>void refreshCloud());
  document.addEventListener('starquest:cloud-synced',()=>void refreshCloud());
  document.addEventListener('visibilitychange',()=>{
    if (document.visibilityState==='visible') void refreshCloud();
  });
  window.StarQuestInfinityWallet = {
    isConnected: function () {
      const selected = window.StarQuestAuth?.currentUser?.();
      return !!cloudState && (!selected || String(selected.key||selected.username||'').toLowerCase() === cloudState.username);
    },
    connect: function () { if (!cloudState) location.href = RECOVERY_URL;return cloudState; },
    refresh: refreshCloud,
    engine: wallet
  };
  render();
  void refreshCloud();
})();
