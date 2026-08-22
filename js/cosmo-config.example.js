// Copy to cosmo-config.js after deploying the secure worker.
// Never put GEMINI_API_KEY in this browser file.
window.STARQUEST_COSMO_CONFIG = Object.assign({}, window.STARQUEST_COSMO_CONFIG, {
  aiEndpoint: "https://YOUR-WORKER.workers.dev/v1/reason",
});
