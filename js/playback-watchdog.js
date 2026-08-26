/**
 * Stops an unresponsive direct stream instead of leaving a frozen frame or an
 * endless loading animation on screen. It never loops or seeks automatically.
 */
(function () {
  "use strict";

  const video = document.getElementById("player-video");
  const loading = document.getElementById("player-loading");
  const loadingText = loading && loading.querySelector(".player-loading-text");
  const error = document.getElementById("player-error");
  const errorMessage = error && error.querySelector(".player-error__msg");
  const retry = document.getElementById("player-retry-btn");
  if (!video || !loading || !error || !retry) return;

  const STALL_LIMIT_MS = 30000;
  let stallTimer = null;
  let retryPosition = 0;

  function clearStall() {
    if (stallTimer) window.clearTimeout(stallTimer);
    stallTimer = null;
  }

  function streamRecovered() {
    clearStall();
    loading.style.display = "none";
    if (error.dataset.playbackStall === "true") error.style.display = "none";
    delete error.dataset.playbackStall;
    retry.style.display = "none";
  }

  function stopFrozenStream() {
    stallTimer = null;
    retryPosition = Math.max(0, Number(video.currentTime) || retryPosition || 0);
    video.pause();
    loading.style.display = "none";
    error.dataset.playbackStall = "true";
    error.style.display = "flex";
    if (errorMessage) {
      errorMessage.textContent = "Playback stopped because the source stopped sending video. StarQuest will not loop a frozen clip.";
    }
    retry.style.display = "inline-flex";
  }

  function watchForStall() {
    if (video.style.display === "none" || video.ended) return;
    retryPosition = Math.max(0, Number(video.currentTime) || retryPosition || 0);
    clearStall();
    if (loadingText) loadingText.textContent = "The source paused. Waiting briefly before stopping…";
    loading.style.display = "flex";
    stallTimer = window.setTimeout(stopFrozenStream, STALL_LIMIT_MS);
  }

  ["playing", "canplay", "timeupdate", "progress"].forEach((name) => {
    video.addEventListener(name, streamRecovered);
  });
  ["waiting", "stalled"].forEach((name) => {
    video.addEventListener(name, watchForStall);
  });
  video.addEventListener("emptied", clearStall);

  retry.addEventListener("click", () => {
    clearStall();
    error.style.display = "none";
    retry.style.display = "none";
    loading.style.display = "flex";
    if (loadingText) loadingText.textContent = "Retrying from your saved spot…";
    const resumeAt = retryPosition;
    video.addEventListener("loadedmetadata", () => {
      const duration = Number(video.duration) || 0;
      if (resumeAt > 0 && (!duration || resumeAt < duration - 5)) video.currentTime = resumeAt;
      const play = video.play();
      if (play && typeof play.catch === "function") play.catch(stopFrozenStream);
    }, { once: true });
    video.load();
  });
})();
