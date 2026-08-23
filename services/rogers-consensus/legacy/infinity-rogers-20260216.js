/**
 * Rogers AI Chat - Cloudflare Worker Proxy
 * Proxies chat requests to Claude API securely.
 * API key stored as Cloudflare secret, never exposed to browser.
 *
 * Deploy: wrangler deploy
 * Set secret: wrangler secret put ANTHROPIC_API_KEY
 */

export default {
  async fetch(request, env) {
    // CORS headers for GitHub Pages
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'POST only' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const userMessage = (body.message || '').trim();
      const repo = body.repo || 'unknown';

      if (!userMessage) {
        return new Response(JSON.stringify({ error: 'Empty message' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Rate limiting: simple per-IP (Cloudflare handles heavy lifting)
      // For production, use Cloudflare Rate Limiting rules

      // System prompt tailored to the Infinity ecosystem
      const systemPrompt = `You are Rogers, the AI assistant for the Infinity ecosystem built by Kris Watson (pewpi-infinity on GitHub). You are embedded in the repo "${repo}".

Key facts about the Infinity ecosystem:
- 900+ GitHub repositories under pewpi-infinity organization
- Crown Index is the master hub connecting all repos
- Spark repos are specialized tools (Hub, Market, Portal, Terminal, Core, etc.)
- smug_look is the Octave main index with Mario Jukebox and MRW Terminal
- Mario Jukebox plays music from Internet Archive with 6 themes
- Mongoose.OS provides firmware-level guidance for each repo
- License tokens start at $1,111 and increase $1/day forever
- Quantum Vector buttons: 🍄Double 🟡Wallet ⭐Trending 👑Royal 💎Facet 🧱Hash 🦾Auto-Bot 🧲Pull 🕹️Search
- Contact and payment fields removed from this archived prompt before publication.

You are helpful, concise, and knowledgeable about the ecosystem. Keep responses under 150 words. Use emoji sparingly. Be professional.`;

      // Call Claude API
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      });

      if (!claudeResponse.ok) {
        const errText = await claudeResponse.text();
        console.error('Claude API error:', claudeResponse.status, errText);
        return new Response(JSON.stringify({
          ok: false,
          error: 'AI service temporarily unavailable',
          fallback: true
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const claudeData = await claudeResponse.json();
      const answer = claudeData.content?.[0]?.text || 'No response generated.';

      return new Response(JSON.stringify({
        ok: true,
        answer: answer,
        repo: repo,
        model: 'rogers-ai',
        token: {
          id: '🧱Rogers🔑',
          type: 'chat_response',
          timestamp: Date.now(),
        },
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        ok: false,
        error: 'Internal error',
        fallback: true
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
