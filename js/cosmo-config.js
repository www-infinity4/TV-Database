// Public runtime settings only. Provider credentials belong in the secure worker.
window.STARQUEST_COSMO_CONFIG = Object.assign({
  aiEndpoint: "https://infinity-rogers.marvaseater.workers.dev/v1/reason",
}, window.STARQUEST_COSMO_CONFIG || {});
