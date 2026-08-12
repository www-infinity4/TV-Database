/**
 * StarQuest Cosmo — on-device Gemma adapter.
 *
 * Gemma is only downloaded after a viewer explicitly presses Start Gemma.
 * Google AI Edge currently requires WebGPU and a large web-compatible model.
 */
(function (global) {
  "use strict";

  const DEFAULT_MODEL = "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it-web.litertlm";
  const MODULE_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai/genai_bundle.mjs";
  const WASM_ROOT = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@latest/wasm";
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

  async function start(systemPrompt) {
    if (conversation) return status();
    if (!supported()) {
      state = "unsupported";
      detail = "This browser/device does not expose WebGPU. Cosmo will use his network and research fallbacks.";
      emit();
      return status();
    }
    state = "loading";
    detail = "Downloading and loading about 2.0 GB of Gemma weights. The first load can take several minutes.";
    emit();
    try {
      const module = await import(MODULE_URL);
      const model = (global.STARQUEST_COSMO_CONFIG && global.STARQUEST_COSMO_CONFIG.gemmaModelUrl) || DEFAULT_MODEL;
      const fileset = await module.FilesetResolver.forGenAiTasks(WASM_ROOT);
      engine = await module.LlmInference.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: model },
        maxTokens: 4096,
        topK: 40,
        temperature: 0.65,
        randomSeed: 101,
      });
      conversation = { systemPrompt: String(systemPrompt || "") };
      state = "ready";
      detail = "Gemma 4 E2B is running locally in this browser.";
    } catch (error) {
      state = "error";
      detail = "Gemma could not start: " + (error && error.message ? error.message : "unknown loading error");
      conversation = null;
      if (engine && typeof engine.close === "function") {
        try { engine.close(); } catch (_) {}
      }
      engine = null;
    }
    emit();
    return status();
  }

  async function prompt(text) {
    if (!conversation) return null;
    try {
      const answer = String(await engine.generateResponse(String(text || ""))).trim();
      return answer || null;
    } catch (error) {
      state = "error";
      detail = "Gemma stopped responding: " + (error && error.message ? error.message : "unknown inference error");
      emit();
      return null;
    }
  }

  async function stop() {
    conversation = null;
    if (engine && typeof engine.close === "function") {
      try { engine.close(); } catch (_) {}
    }
    engine = null;
    state = "idle";
    detail = "Gemma was released from memory.";
    emit();
  }

  global.StarQuestGemma = { start, stop, prompt, status, supported };
})(window);
