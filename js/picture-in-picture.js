/**
 * Android/desktop Picture-in-Picture control for StarQuest's native video.
 * The operating system owns the floating window, so it can move over other
 * apps without StarQuest requesting Android's broad overlay permission.
 */
(function (global) {
  "use strict";

  const document = global.document;
  const video = document && document.getElementById("player-video");
  const frame = document && document.getElementById("player-frame");
  const button = document && document.getElementById("player-pip-btn");
  if (!video || !button) return;

  const supported = Boolean(document.pictureInPictureEnabled && typeof video.requestPictureInPicture === "function");

  function hasDirectVideo() {
    return Boolean(video.currentSrc || video.getAttribute("src")) && video.style.display !== "none";
  }

  function notice(message) {
    document.dispatchEvent(new CustomEvent("starquest:toast", { detail: { message: message } }));
  }

  function render() {
    const floating = document.pictureInPictureElement === video;
    button.classList.toggle("player-pip-btn--active", floating);
    button.textContent = floating ? "▣ Floating" : "▣ Float";
    if (!supported) {
      button.disabled = true;
      button.title = "Picture-in-Picture is not available in this browser";
      button.setAttribute("aria-label", button.title);
      return;
    }
    button.disabled = false;
    const direct = hasDirectVideo();
    button.title = direct
      ? "Float this video over other apps"
      : "Waiting for a direct video stream; embedded players control their own floating mode";
    button.setAttribute("aria-label", button.title);
  }

  async function togglePictureInPicture() {
    if (!supported) return;
    if (document.pictureInPictureElement === video) {
      await document.exitPictureInPicture();
      return;
    }
    if (!hasDirectVideo()) {
      notice(frame && frame.style.display !== "none"
        ? "This program is using an embedded player. Use its own Picture-in-Picture control, or choose a direct-play StarQuest video."
        : "The direct video is still loading. Try Float again when playback starts.");
      return;
    }
    try {
      if (video.paused) await video.play();
      await video.requestPictureInPicture();
    } catch (error) {
      notice("Your browser did not open the floating player. Start the video, then tap Float again.");
    }
  }

  button.addEventListener("click", togglePictureInPicture);
  video.addEventListener("enterpictureinpicture", render);
  video.addEventListener("leavepictureinpicture", render);
  ["loadedmetadata", "canplay", "play", "emptied", "error"].forEach(function (eventName) {
    video.addEventListener(eventName, render);
  });
  document.addEventListener("starquest:episode-opened", function () { global.setTimeout(render, 0); });
  new MutationObserver(render).observe(video, { attributes: true, attributeFilter: ["src", "style"] });
  render();
})(window);
