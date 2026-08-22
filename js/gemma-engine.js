/**
 * StarQuest Cosmo — consent-based, on-device Gemma adapter.
 * The model downloads only after the viewer presses Start Gemma.
 */
(function (global) {
  "use strict";

  const DEFAULT_MODEL = "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it-web.litertlm";
  const MODULE_URL = "https://cdn.jsdelivr.net/npm/@litert-lm/core/+esm";
  let engine = null;
  let conversation = null;
  let state = "idle";
  let detail = "Gemma is available but not downloaded (about 2.0 GB).";

  function emit() {
    document.dispatchEvent(new CustomEvent("starquest:gemma-state", { detail: status() }));
  }

  function supported() {
    return !!(global.navigator && global.navigator.gpu);
  }

  function status() {
    return { state, detail, supported: supported(), ready: state === "ready" };
  }

  function releaseEngine() {
    conversation = null;
    if (engine && typeof engine.delete === "function") {
      try { engine.delete(); } catch (_) {}
    }
    engine = null;
  }

  async function start(systemPrompt) {
    if (conversation) return status();
    if (!supported()) {
      state = "unsupported";
      detail = "This device does not expose WebGPU. Cosmo can use the secure network model when it is configured.";
      emit();
      return status();
    }
    state = "loading";
    detail = "Downloading and loading about 2.0 GB of Gemma weights. The first load can take several minutes.";
    emit();
    try {
      const module = await import(MODULE_URL);
      if (!module.Engine || typeof module.Engine.create !== "function") throw new Error("LiteRT-LM Engine is unavailable");
      const model = (global.STARQUEST_COSMO_CONFIG && global.STARQUEST_COSMO_CONFIG.gemmaModelUrl) || DEFAULT_MODEL;
      engine = await module.Engine.create({ model, mainExecutorSettings: { maxNumTokens: 4096 } });
      conversation = engine.createConversation({
        preface: { messages: [{ role: "system", content: String(systemPrompt || "") }] },
      });
      state = "ready";
      detail = "Gemma 4 E2B is running locally in this browser.";
    } catch (error) {
      state = "error";
      detail = "Gemma could not start: " + (error && error.message ? error.message : "unknown loading error");
      releaseEngine();
    }
    emit();
    return status();
  }

  async function prompt(text) {
    if (!conversation) return null;
    try {
      const response = await conversation.sendMessage(String(text || ""));
      const blocks = response && Array.isArray(response.content) ? response.content : [];
      const answer = blocks.map((block) => typeof block === "string" ? block : block && block.text || "").join("\n").trim();
      return answer || null;
    } catch (error) {
      state = "error";
      detail = "Gemma stopped responding: " + (error && error.message ? error.message : "unknown inference error");
      emit();
      return null;
    }
  }

  async function stop() {
    releaseEngine();
    state = "idle";
    detail = "Gemma was released from memory.";
    emit();
  }

  global.StarQuestGemma = { start, stop, prompt, status, supported };
})(window);
