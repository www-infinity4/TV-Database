(function (root) {
  'use strict';

  const DB_NAME = 'starquest_sona_cards_v1';
  const STORE = 'captures';
  const capturedKeys = new Set();
  let context = null;

  function mediaKind(show) {
    const type = String(show && show.type || '').toLowerCase();
    return ['music-video', 'concert', 'song'].includes(type) ? 'SONG' : 'MOVIE';
  }

  function isEligible(show) {
    const type = String(show && show.type || '').toLowerCase();
    return ['movie', 'documentary', 'music-video', 'concert', 'song'].includes(type);
  }

  function digestBytes(bytes) {
    return crypto.subtle.digest('SHA-256', bytes).then(buffer =>
      'sha256:' + Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('')
    );
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      if (!root.indexedDB) return reject(new Error('IndexedDB is unavailable.'));
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE, { keyPath: 'captureId' });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function save(capture) {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(capture);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  }

  function pendingCapture(reason) {
    const now = new Date().toISOString();
    return {
      schema: 'sona/media-frame/v1',
      captureId: 'sona-pending:' + context.mediaId,
      mediaId: context.mediaId,
      mediaKind: context.mediaKind,
      title: context.title,
      capturedAt: now,
      imageUrl: null,
      contentDigest: null,
      playbackSeconds: Math.max(0, Number(context.video.currentTime) || 0),
      sourceUrl: context.video.currentSrc || null,
      captureAgent: 'SONA',
      status: 'PENDING_SOURCE_PERMISSION',
      failureReason: reason
    };
  }

  async function captureCurrentFrame() {
    if (!context || !context.video || context.video.readyState < 2) throw new Error('No native movie or song frame is ready.');
    const video = context.video;
    const width = Math.min(960, Number(video.videoWidth) || 0);
    const sourceHeight = Number(video.videoHeight) || 0;
    if (!width || !sourceHeight) throw new Error('The playing media has no drawable frame yet.');
    const height = Math.round(sourceHeight * (width / video.videoWidth));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    try {
      const drawing = canvas.getContext('2d', { alpha: false });
      drawing.drawImage(video, 0, 0, width, height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88));
      if (!blob) throw new Error('The browser could not encode the captured frame.');
      const bytes = await blob.arrayBuffer();
      const contentDigest = await digestBytes(bytes);
      const imageUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
      const capture = {
        schema: 'sona/media-frame/v1',
        captureId: 'sona:' + contentDigest.slice(7, 39),
        mediaId: context.mediaId,
        mediaKind: context.mediaKind,
        title: context.title,
        capturedAt: new Date().toISOString(),
        imageUrl,
        contentDigest,
        playbackSeconds: Math.max(0, Number(video.currentTime) || 0),
        sourceUrl: video.currentSrc || null,
        captureAgent: 'SONA',
        status: 'CAPTURED',
        failureReason: null
      };
      await save(capture);
      capturedKeys.add(context.key);
      document.dispatchEvent(new CustomEvent('starquest:sona-card-captured', { detail: capture }));
      return capture;
    } catch (error) {
      const capture = pendingCapture(error instanceof DOMException && error.name === 'SecurityError'
        ? 'This source blocks cross-origin frame capture. No substitute artwork was used.'
        : String(error && error.message || error));
      document.dispatchEvent(new CustomEvent('starquest:sona-card-pending', { detail: capture }));
      if (error instanceof DOMException && error.name === 'SecurityError') capturedKeys.add(context.key);
      throw error;
    }
  }

  document.addEventListener('starquest:episode-opened', event => {
    const episode = event.detail && event.detail.ep;
    const title = event.detail && event.detail.showTitle;
    const show = event.detail && event.detail.show;
    if (!isEligible(show)) { context = null; return; }
    const video = document.getElementById('player-video');
    const mediaId = String(episode && (episode.id || episode.archiveId || episode.youtubeId) || show && show.id || title || 'unknown');
    context = { video, mediaId, mediaKind: mediaKind(show), title: String(episode && episode.title || title || 'Untitled media'), key: mediaId, attempts: 0, capturing: false };
  });

  document.addEventListener('timeupdate', () => {
    if (!context || context.capturing || context.attempts >= 3 || capturedKeys.has(context.key)) return;
    if (context.video.currentTime < 8) return;
    context.capturing = true;
    context.attempts += 1;
    captureCurrentFrame().catch(() => {}).finally(() => { if (context) context.capturing = false; });
  }, true);

  root.StarQuestSonaCards = { captureCurrentFrame, databaseName: DB_NAME };
})(window);
