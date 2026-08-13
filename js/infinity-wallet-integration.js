/* StarQuest → Unified Infinity Wallet adapter */
(function () {
  'use strict';
  const button = document.getElementById('unified-wallet-connect');
  const status = document.getElementById('unified-wallet-status');
  if (!window.InfinityUnifiedWallet) {
    if (status) status.textContent = 'Unified wallet engine unavailable. Paid unlocks remain closed.';
    window.StarQuestInfinityWallet = { isConnected: function () { return false; } };
    return;
  }
  const wallet = new window.InfinityUnifiedWallet.UnifiedInfinityWallet();
  const slug = value => String(value || 'unresolved').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'unresolved';
  function current() { return wallet.state.currentWalletId && wallet.state.wallets[wallet.state.currentWalletId]; }
  function setStatus(message) { if (status) status.textContent = message; }
  function render() {
    const connected = current();
    if (button) button.textContent = connected ? 'Unified Wallet · ' + connected.walletId.slice(-8) : 'Connect Unified Wallet';
    setStatus(connected ? 'Movie unlocks and rights allocations will use the unified wallet.' : 'Connect before using StarCoins to unlock a movie.');
  }
  if (button) button.addEventListener('click', function () {
    if (!current()) wallet.createWallet({ displayName: 'Unified Infinity Wallet' });
    else location.href = 'https://www-infinity4.github.io/Mint-For-Infinity/unified-wallet.html';
    render();
  });
  document.addEventListener('starquest:content-unlocked', async function (event) {
    const connected = current();
    const detail = event.detail || {};
    const unlock = detail.unlock || {};
    if (!connected || detail.alreadyUnlocked || !unlock.cost) return;
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
      setStatus('Movie unlocked for ' + unlock.cost + ' StarCoin. The recipient received a blank Infinity token; rights allocations were recorded separately.');
    } catch (error) { setStatus('Unlock completed, but unified wallet reconciliation needs review: ' + error.message); }
  });
  window.StarQuestInfinityWallet = { isConnected: function () { return !!current(); }, connect: function () { if (!current()) wallet.createWallet({ displayName: 'Unified Infinity Wallet' }); render(); return current(); }, engine: wallet };
  render();
})();
