# Cosmo AI Gateway

Secure server-side gateway source for StarQuest Cosmo.

## Endpoints

- `GET /health` reports service and model configuration.
- `POST /v1/reason`, `/v1/chat`, or `/api/cosmo` accepts the existing StarQuest JSON contract and returns `output` plus `output_text`.
- `POST /v1/realtime/token` creates a short-lived OpenAI Realtime client secret for WebRTC speech-to-speech voice.

## Required server secrets

- `OPENAI_API_KEY` — server-side only; never place it in GitHub Pages JavaScript.
- Optional: `OPENAI_MODEL`, `OPENAI_REALTIME_MODEL`, and `OPENAI_VOICE`.

The deployed gateway accepts browser requests only from `https://www-infinity4.github.io`, rate-limits callers, caps input size, and disables OpenAI response storage.
