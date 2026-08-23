/**
 * StarQuest — AI Companion (Cosmo)
 * Primary local engine: Gemma through the official LiteRT-LM Web API.
 * Network and Chrome fallbacks provide open conversation on devices that
 * cannot run the large WebGPU model. Offline code is limited to transparent
 * StarQuest tools and never pretends a scripted line came from a model.
 *
 * Features:
 *  - Real conversation memory (last 12 exchanges)
 *  - Context injection: knows what you are currently watching
 *  - Watch-along pop-ins: Cosmo pops up mid-episode with a comment
 *  - Personalized recommendations based on user genre affinity
 */

(function (global) {
  "use strict";

  /* ─────────────────────────────────────────────────────────────
     KNOWLEDGE BASE
     Behind-the-scenes facts, trivia, and show information.
     ──────────────────────────────────────────────────────────── */
  const KNOWLEDGE = {
    /* General */
    greetings: [
      "Hey there, Star! 🌟 I'm Cosmo, your StarQuest AI companion. Ask me anything about classic TV, movies, behind-the-scenes secrets, or the stars themselves!",
      "Welcome, adventurer! ⭐ I'm Cosmo. I know everything about 1970s–1990s classic TV. What do you want to explore?",
      "Hi! I'm Cosmo, StarQuest's AI companion. 🎮 I've got the scoop on every show in our galaxy. What's on your mind?",
    ],
    unknown: [
      "Hmm, that's a tough one even for me! 🤔 Try asking about a specific show, actor, or era.",
      "I'm still learning about that. Try asking me about Due South, Ghostbusters, The Twilight Zone, or any 80s–90s classic!",
      "Great question! I might not have that exact fact, but ask me about any show in our catalogue and I'll give you the full scoop.",
    ],

    /* Show facts */
    shows: {
      "due south": {
        summary:
          "Due South (1994–1998) starred Paul Gross as Constable Benton Fraser — a polite Canadian Mountie posted to the Chicago consulate. He teamed up with brash Chicago cop Ray Vecchio (David Marciano) and his partially deaf wolf Diefenbaker. The show was a Canadian-American co-production.",
        trivia: [
          "Paul Gross co-wrote many episodes and even composed some of the music.",
          "Diefenbaker the wolf was actually played by multiple animals — the main one was named Lincoln.",
          "The show was cancelled, brought back due to massive fan campaigns, and ran 4 full seasons.",
          "Due South is one of the most successful Canadian TV exports to the US — it aired on CBS and then CTV.",
          "Fraser's deaf wolf Diefenbaker was named after Canadian Prime Minister John Diefenbaker.",
          "The show filmed mostly in Toronto but set scenes in Chicago, often making Toronto stand in for the Windy City.",
        ],
      },
      "twilight zone": {
        summary:
          "The Twilight Zone (1959–1964) was created and hosted by Rod Serling. Each episode was a standalone story involving fantasy, horror, or science fiction with a twist ending. It tackled social issues like racism, conformity, and nuclear war through allegory.",
        trivia: [
          "Rod Serling wrote 92 of the 156 original episodes himself.",
          "The famous theme music was composed by Marius Constant.",
          'The phrase "submitted for your approval" became one of the most quoted TV lines ever.',
          "CBS originally rejected the pilot, but Rod Serling reworked it and the network picked it up.",
          "Many future Hollywood stars appeared on the show, including Robert Redford, Dennis Hopper, and Burt Reynolds.",
          "The show pioneered the anthology format that shows like Black Mirror still use today.",
        ],
      },
      "real ghostbusters": {
        summary:
          "The Real Ghostbusters (1986–1991) was an animated sequel to the 1984 film. It followed Peter, Egon, Ray, Winston, Janine, and their green ghost mascot Slimer. Developed by DiC Entertainment, it was praised for its sophisticated writing.",
        trivia: [
          "The show was called 'The REAL Ghostbusters' because a rival Filmation show called Ghostbusters existed from the 1970s.",
          "Lorenzo Music (Garfield) voiced Peter Venkman in Season 1. Bill Murray himself asked to have Music replaced with Dave Coulier.",
          "Writer J. Michael Straczynski (later creator of Babylon 5) wrote many of the best-received episodes.",
          "Slimer was originally based on John Belushi's character from Animal House, according to the film's creators.",
          "The show has 140 episodes — far more than any other animated superhero show of its era.",
        ],
      },
      "northern exposure": {
        summary:
          "Northern Exposure (1990–1995) starred Rob Morrow as Dr. Joel Fleischman, a New York doctor sent to the quirky fictional Alaskan town of Cicely. CBS's Emmy-winning drama blended philosophy, Native American culture, and sharp comedy.",
        trivia: [
          "The show was actually filmed primarily in Roslyn, Washington — not Alaska.",
          "John Corbett (Chris in the Morning) went on to star in Sex and the City as Aidan.",
          "The show won the Emmy for Outstanding Drama Series in 1992.",
          "Creator Joshua Brand said the show was partly inspired by his own experience moving to a small town.",
          "Cicely, Alaska was a fictitious town — but Roslyn, WA now has Northern Exposure tourism because of the show.",
        ],
      },
      mash: {
        summary:
          "M*A*S*H (1972–1983) was based on the 1970 film and Robert Altman's novel. Set during the Korean War, it followed the staff of the 4077th Mobile Army Surgical Hospital. The series finale 'Goodbye, Farewell and Amen' was the most-watched TV episode in history at the time.",
        trivia: [
          "The series finale in 1983 drew 106 million viewers — a record that stood for 27 years.",
          "Alan Alda was the only cast member to appear in all 11 seasons.",
          "Hawkeye Pierce (Alan Alda) was the show's moral compass and a vocal advocate for ending the war.",
          "The show ran 11 seasons — three times longer than the actual Korean War.",
          "Gary Burghoff (Radar) is the only actor who appeared in both the film and the TV series.",
        ],
      },
      ghostbusters: {
        summary:
          "Ghostbusters (1984) was directed by Ivan Reitman and written by Dan Aykroyd and Harold Ramis. Bill Murray, Dan Aykroyd, Harold Ramis, and Ernie Hudson played the original team. The film was a massive cultural phenomenon.",
        trivia: [
          "The original script by Dan Aykroyd was set in the future and featured dozens of Ghostbusters.",
          "John Belushi was originally considered for one of the lead roles before his death in 1982.",
          "Bill Murray improvised most of his best lines.",
          "The Ghostbusters logo was designed by Michael C. Gross and was created without the red slash originally.",
          "Stay Puft Marshmallow Man was chosen as the destroyer because Dan Aykroyd thought nothing threatening could hurt a marshmallow.",
          "The film was made for $32 million and grossed $295 million — one of the biggest comedy hits ever.",
        ],
      },
      "star trek": {
        summary:
          "Star Trek: The Original Series (1966–1969) was created by Gene Roddenberry. Captain Kirk (William Shatner), Mr. Spock (Leonard Nimoy), and Dr. McCoy (DeForest Kelley) boldly went where no one had gone before on the USS Enterprise.",
        trivia: [
          "NBC almost cancelled the show after the first season, but a massive fan letter-writing campaign saved it.",
          "Nichelle Nichols (Uhura) considered leaving the show until Martin Luther King Jr. personally asked her to stay.",
          "The Vulcan salute was invented by Leonard Nimoy, based on a Jewish priestly blessing gesture.",
          "The show was so forward-thinking it featured TV's first interracial kiss between Kirk and Uhura.",
          "William Shatner and Leonard Nimoy were not friends on set — their characters' friendship was entirely acting.",
        ],
      },
      "x-men": {
        summary:
          "X-Men: The Animated Series debuted in 1992 and quickly became one of the defining cartoons of the decade. Its two-part pilot 'Night of the Sentinels' introduced Jubilee, Cyclops, Storm, Wolverine, and the team to a new generation.",
        trivia: [
          "The show tackled themes of civil rights, prejudice, and discrimination more directly than almost any other kids' show.",
          "The iconic theme music by Ron Wasserman was originally rejected by the network but fans loved it.",
          "The show ran for 76 episodes and directly inspired the X-Men film franchise.",
          "Morph's apparent death in the pilot was a bold move for a Saturday morning cartoon.",
          "The Phoenix Saga episodes are considered among the finest animated storytelling ever made for children.",
        ],
      },
      cheers: {
        summary:
          "Cheers (1982–1993) was set in a Boston bar where everybody knows your name. Sam Malone (Ted Danson), Diane Chambers (Shelley Long), and later Rebecca Howe (Kirstie Alley) anchored one of TV's greatest ensemble casts.",
        trivia: [
          "The show started with poor ratings and almost got cancelled after its first season.",
          "Frasier Crane (Kelsey Grammer) was meant to be a one-episode character but was so popular he stayed.",
          'The bar exterior used in establishing shots is actually the Bull & Finch Pub in Boston, now called "Cheers".',
          "Shelley Long left the show voluntarily — it then became even more popular.",
          "The series finale in 1993 drew 93 million viewers, the second most watched finale ever at the time.",
        ],
      },
      seinfeld: {
        summary:
          "Seinfeld (1989–1998) was co-created by Jerry Seinfeld and Larry David. The 'show about nothing' followed Jerry and his friends George, Elaine, and Kramer navigating mundane New York life with hilarious results.",
        trivia: [
          "Larry David based George Costanza largely on himself.",
          'NBC initially called the pilot "too New York" and "too Jewish" — they almost didn\'t pick it up.',
          "The famous 'no hugging, no learning' rule was Larry David's mantra for the show.",
          "Jerry Seinfeld turned down $5 million per episode to do a 10th season.",
          "Michael Richards improvised virtually everything Kramer did physically in a scene.",
          "The finale was watched by 76 million people, though it remains controversial with fans.",
        ],
      },
      columbo: {
        summary:
          "Columbo (1971–2003) starred Peter Falk as Lieutenant Columbo, a seemingly bumbling but brilliantly deceptive LAPD detective. Unlike typical mysteries, viewers always saw the murder committed first, then watched Columbo unravel the killer.",
        trivia: [
          "Peter Falk wore his own real glass eye — his right eye had been removed due to retinoblastoma as a child.",
          "The character was originally played by Bert Freed in a 1960 stage play.",
          "Columbo's wife is mentioned in nearly every episode but is never shown on screen.",
          "Steven Spielberg directed the first Columbo TV movie at age 24.",
          "The show's 'just one more thing' catchphrase was almost entirely improvised by Falk.",
        ],
      },
      "superman ii": {
        summary:
          "Superman II (1980/1981) pitted Superman (Christopher Reeve) against three Kryptonian supervillains — General Zod, Ursa, and Non. The film had a troubled production: Richard Donner shot it simultaneously with the first film but was fired and replaced by Richard Lester.",
        trivia: [
          "Richard Donner was 75% done filming when he was replaced by Richard Lester due to a dispute with producers.",
          "A 'Richard Donner Cut' was released in 2006, restoring much of his original vision.",
          "Marlon Brando's scenes as Jor-El were cut from Lester's version due to a salary dispute.",
          "The ABC broadcast version used in StarQuest is 143 minutes — 16 minutes longer than the theatrical release.",
          "Terence Stamp's 'Kneel before Zod!' became one of the most quoted movie lines of the 1980s.",
        ],
      },
      "v the series": {
        summary:
          "V: The Series (1984–1985) was the NBC weekly follow-up to the acclaimed V miniseries. Marc Singer led the human resistance against the alien Visitors, aided by Diana (Jane Badler) as the main villain and Michael Ironside as Ham Tyler.",
        trivia: [
          "The original V miniseries was a conscious allegory for the rise of Nazi Germany.",
          "Robert Englund (Freddy Krueger) played Willie, a friendly alien, before his Nightmare on Elm Street fame.",
          "The show was cancelled on a cliffhanger, leaving many storylines unresolved.",
          "Marc Singer wore contact lenses throughout filming to differentiate the human characters from aliens.",
          "Jane Badler's Diana became one of TV's most iconic female villains.",
        ],
      },
      nirvana: {
        summary:
          "Nirvana's MTV Unplugged in New York (1993) was recorded on November 18, 1993, just five months before Kurt Cobain's death. The performance included covers of David Bowie, Lead Belly, and the Meat Puppets alongside reimagined Nirvana classics.",
        trivia: [
          "The set was decorated with candles and lilies — Kurt Cobain requested it to look like a funeral.",
          "The cover of 'Where Did You Sleep Last Night' (Lead Belly) remains one of the most powerful live performances ever recorded.",
          "MTV Unplugged in New York won the Grammy for Best Alternative Album in 1995.",
          "Pat Smear joined as rhythm guitarist — it was Nirvana's first major performance with him.",
          "The show was broadcast on MTV on December 14, 1993 — Cobain died on April 5, 1994.",
        ],
      },
    },

    /* Decade facts */
    decades: {
      "1980s": "The 1980s were TV's era of glitz and glamour — Dynasty, Dallas, and Miami Vice defined the decade. Cable TV exploded with MTV (1981), CNN, and HBO original programming. The VCR became a household item, letting people record and rewatch shows for the first time.",
      "1990s": "The 1990s were the golden age of must-see TV. NBC's Thursday lineup (Friends, Seinfeld, ER) dominated ratings. The rise of Fox as a 4th network changed the landscape. The decade ended with the dawn of streaming — Netflix launched as a DVD service in 1997.",
      "1970s": "The 1970s saw TV tackle real-world issues head-on. All in the Family, M*A*S*H, and The Mary Tyler Moore Show changed what TV was allowed to say and depict. The decade ended with Dallas proving prime-time soap operas could dominate ratings.",
    },

    /* Token/wallet facts */
    tokens: {
      howToEarn:
        "Every completed share adds 1/10 to your StarCoin counter. The 10th completed share creates 1 StarCoin. Watching still builds your personal history and recommendations, but watch time does not mint coins.",
      whatFor:
        "StarCoins ⭐ are your reward for being a loyal Star! They'll be used for Pay-Per-View access to premium new content — think HBO-quality originals — coming to StarQuest. Collect them now!",
    },

    /* Companion personality */
    personality: {
      name: "Cosmo",
      role: "StarQuest AI Companion",
      catchphrases: [
        "The stars are the limit! ⭐",
        "Let's explore the galaxy of classic TV! 🚀",
        "Every show tells a story — let's find yours! 📺",
      ],
    },
  };

  /* ─────────────────────────────────────────────────────────────
     INTENT MATCHING
     ──────────────────────────────────────────────────────────── */

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  }

  function queryContainsTitle(query, title) {
    const q = normalize(query);
    const titleNorm = normalize(title);
    if (!q || !titleNorm) return false;
    /* Very short catalogue titles such as "M" must match a complete word.
       Otherwise every question containing that letter becomes a movie query. */
    if (titleNorm.length <= 2) return q.split(" ").includes(titleNorm);
    return q.includes(titleNorm) || (q.length >= 4 && titleNorm.includes(q));
  }

  function matchShow(query) {
    const q = normalize(query);
    const entries = Object.entries(KNOWLEDGE.shows);
    /* Longest-key-first for better specificity */
    entries.sort((a, b) => b[0].length - a[0].length);
    for (const [key, data] of entries) {
      if (q.includes(key)) return { key, data };
    }
    /* Also check SHOWS data array for show titles */
    if (typeof SHOWS !== "undefined") {
      for (const show of SHOWS) {
        const titleNorm = normalize(show.title);
        if (queryContainsTitle(q, titleNorm)) {
          return {
            key: titleNorm,
            data: {
              summary: show.description,
              trivia: [
                `${show.title} ran from ${show.years}.`,
                `Genre: ${show.genre.join(", ")}.`,
                `Critic score: ★ ${show.score} / 10.`,
              ],
            },
          };
        }
      }
    }
    return null;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /* ─────────────────────────────────────────────────────────────
     RESPONSE ENGINE
     ──────────────────────────────────────────────────────────── */

  function generateResponse(userMessage) {
    const q = normalize(userMessage);

    /* Greetings */
    if (/^(hi|hello|hey|howdy|sup|yo|greetings)/.test(q)) {
      return pickRandom(KNOWLEDGE.greetings);
    }

    /* Who are you */
    if (q.includes("who are you") || q.includes("what are you") || q.includes("your name")) {
      return `I'm Cosmo, StarQuest's AI companion! 🌟 I'm trained on the history of classic TV (1950s–1990s), behind-the-scenes secrets, actor trivia, and everything in the StarQuest catalogue. Ask me anything!`;
    }

    /* Token/wallet questions */
    if (q.includes("token") || q.includes("coin") || q.includes("starcoin") || q.includes("wallet") || q.includes("earn")) {
      if (q.includes("what") || q.includes("how") || q.includes("why")) {
        return KNOWLEDGE.tokens.whatFor;
      }
      return KNOWLEDGE.tokens.howToEarn;
    }

    /* Decade questions */
    if (q.includes("1980") || q.includes("80s") || q.includes("eighties")) {
      return "📼 " + KNOWLEDGE.decades["1980s"];
    }
    if (q.includes("1990") || q.includes("90s") || q.includes("nineties")) {
      return "📼 " + KNOWLEDGE.decades["1990s"];
    }
    if (q.includes("1970") || q.includes("70s") || q.includes("seventies")) {
      return "📼 " + KNOWLEDGE.decades["1970s"];
    }

    /* Trivia / secret / fact request */
    const wantTrivia =
      q.includes("trivia") ||
      q.includes("secret") ||
      q.includes("fact") ||
      q.includes("behind the scenes") ||
      q.includes("did you know") ||
      q.includes("tell me") ||
      q.includes("interesting");

    /* Show-specific queries */
    const showMatch = matchShow(q);
    if (showMatch) {
      const { data } = showMatch;
      if (wantTrivia && data.trivia && data.trivia.length) {
        const fact = pickRandom(data.trivia);
        return `🎬 Fun fact: ${fact}`;
      }
      if (
        q.includes("about") ||
        q.includes("what is") ||
        q.includes("summary") ||
        q.includes("describe") ||
        q.includes("explain")
      ) {
        return `📺 ${data.summary}`;
      }
      /* Default: give summary */
      return `📺 ${data.summary}${data.trivia ? "\n\n💡 Fun fact: " + pickRandom(data.trivia) : ""}`;
    }

    /* Pluto TV */
    if (q.includes("pluto")) {
      return "Pluto TV is a free streaming service with live channels and on-demand content. You can access it from the hamburger menu ☰ — we've linked it there for you! StarQuest focuses on 1950s–1990s classics, while Pluto TV has modern content.";
    }

    /* Watch history */
    if (q.includes("history") || q.includes("watched") || q.includes("continue")) {
      return "Your watch history is saved in the ☰ menu! Click the hamburger icon in the top-right to open it. You'll see everything you've watched and can jump back to where you left off.";
    }

    /* Recommendation */
    if (
      q.includes("recommend") ||
      q.includes("suggest") ||
      q.includes("what should i watch") ||
      q.includes("what to watch")
    ) {
      /* Use actual SHOWS data with personalization if available */
      if (typeof SHOWS !== "undefined" && SHOWS.length) {
        /* Build affinity profile from watch history if available */
        let profile = {};
        if (typeof StarQuestAuth !== "undefined") {
          const history = StarQuestAuth.getHistory();
          if (history && history.length) {
            history.forEach((item) => {
              const show = SHOWS.find((s) => s.title.toLowerCase() === (item.showTitle || "").toLowerCase());
              if (show && show.genre) {
                show.genre.forEach((g) => { profile[g] = (profile[g] || 0) + 1; });
              }
            });
          }
        }

        const hasProfile = Object.keys(profile).length > 0;
        const freeShows = SHOWS.filter((s) => !s.payToWatch && s.score >= 8);

        let picks;
        if (hasProfile) {
          /* Sort by genre affinity then score */
          picks = freeShows
            .slice()
            .sort((a, b) => {
              const aAff = a.genre.reduce((sum, g) => sum + (profile[g] || 0), 0);
              const bAff = b.genre.reduce((sum, g) => sum + (profile[g] || 0), 0);
              if (bAff !== aAff) return bAff - aAff;
              return (b.score || 0) - (a.score || 0);
            })
            .slice(0, 3);
          const topGenreName = Object.entries(profile).sort((a, b) => b[1] - a[1])[0][0];
          return (
            "Based on what you've been watching, here are my top picks for you:\n\n" +
            picks.map((s) => `⭐ **${s.title}** (${s.years}) — ${s.description.slice(0, 80)}…`).join("\n") +
            `\n\nYou seem to love **${topGenreName}** — you'll especially enjoy ${picks[0].title}! Ask me anything about it.`
          );
        } else {
          /* Top-rated free shows */
          picks = freeShows
            .slice()
            .sort((a, b) => (b.score || 0) - (a.score || 0))
            .slice(0, 3);
          return (
            "Here are StarQuest's top-rated picks to start with:\n\n" +
            picks.map((s) => `⭐ **${s.title}** (${s.years}) — ${s.description.slice(0, 80)}…`).join("\n") +
            "\n\nWatch a few episodes and I'll start personalizing these picks just for you! 🎯"
          );
        }
      }
      /* Fallback if SHOWS not loaded */
      const picks = [
        "🌟 Due South — A charming Canadian Mountie in Chicago. Perfect for mystery-comedy fans!",
        "👻 The Real Ghostbusters — Better than the movie? Many fans think so! Smart writing for all ages.",
        "🕵️ The New Alfred Hitchcock Presents — Masterful suspense anthology. Each episode is a mini-thriller.",
      ];
      return (
        "Here are some StarQuest picks for you:\n\n" +
        picks.join("\n") +
        "\n\n💡 Ask me about any show for more details!"
      );
    }

    /* Mario / theme */
    if (q.includes("mario") || q.includes("theme") || q.includes("nintendo")) {
      return "🍄 StarQuest rocks a Mario-inspired theme because finding your favorite star should feel like grabbing a Super Star — unstoppable and exciting! The theme gives you that 1980s arcade energy while you browse classics from the same era. More themes coming soon!";
    }

    /* StarQuest what/why */
    if (q.includes("starquest") || (q.includes("what") && q.includes("this"))) {
      return "⭐ StarQuest is your personal classic TV & movie streaming galaxy! We focus on 1950s–1990s content from the public domain and archive.org. Watch free, save your viewing history, and earn one StarCoin after every 10 completed shares. It's like the video rental store of the 90s — but better!";
    }

    return "I don't have a reliable offline answer for that yet. Cosmo's live AI endpoint is not connected on this device, so I won't guess or substitute an unrelated movie. I can still help with StarQuest titles, playback, recommendations, watch history, StarCoins, and the catalogue ledger.";
  }

  /* ─────────────────────────────────────────────────────────────
     NETWORK AI
     StarQuest is a static GitHub Pages site, so provider secrets must never
     be embedded here. Cosmo calls the configured Infinity AI gateway, which
     keeps credentials and model access server-side. During local development
     it can use the existing loopback Infinity runtime.
     ──────────────────────────────────────────────────────────── */

  /**
   * Build an OpenAI-format messages array: system prompt + conversation
   * history + the new user message. This is what ChatGPT/Gemini calls use,
   * giving Cosmo full memory of the conversation.
   */
  function buildMessages(userText) {
    const history = _convHistory.slice(-MAX_CONV_HISTORY).map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    }));
    return [
      { role: "system",    content: buildSystemPrompt() },
      ...history,
      { role: "user",      content: userText },
    ];
  }

  /**
   * Call the configured server-side AI gateway.
   * Returns the response string, or null if the request fails.
   * Aborts after 7 seconds so the dependable local Cosmo response is never hidden behind a stalled network request.
   */
  let _networkState = "ready";
  function setNetworkState(state, detail) {
    _networkState = state;
    document.dispatchEvent(new CustomEvent("starquest:cosmo-provider", {
      detail: { state, provider: "network-ai", message: detail || "" }
    }));
  }

  function networkEndpoint() {
    const configured = global.STARQUEST_COSMO_CONFIG && global.STARQUEST_COSMO_CONFIG.aiEndpoint;
    if (configured) return String(configured).trim();
    if (/^(localhost|127\.0\.0\.1)$/.test(global.location && global.location.hostname || "")) {
      return "http://127.0.0.1:11435/v1/reason";
    }
    return "";
  }

  function readNetworkText(raw) {
    const value = String(raw || "").trim();
    if (!value || /^<!doctype html/i.test(value)) return null;
    try {
      const parsed = JSON.parse(value);
      return String(
        (parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content) ||
        parsed.output || parsed.output_text || parsed.text || ""
      ).trim() || null;
    } catch (_) {
      return value;
    }
  }

  async function _callNetworkAI(messages) {
    const endpoint = networkEndpoint();
    if (!endpoint) {
      setNetworkState("unconfigured", "Live AI needs the secure Infinity gateway; offline tools remain available.");
      return null;
    }
    const controller = new AbortController();
    // Rogers runs two independent answers in parallel and then a monitoring
    // arbiter, so allow the complete consensus round to finish.
    const timer = setTimeout(() => controller.abort(), 20000);
    setNetworkState("thinking", "Cosmo is thinking with Infinity AI…");
    try {
      const latest = messages[messages.length - 1] || {};
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          input: String(latest.content || ""),
          context: {
            application: "StarQuest",
            system: String((messages[0] && messages[0].content) || "").slice(0, 12000),
            conversation: messages.slice(1, -1).slice(-12),
            interests: global.StarQuestCosmoContext ? global.StarQuestCosmoContext.snapshot(12) : []
          }
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        setNetworkState("fallback", "Infinity AI returned " + res.status + "; offline tools are active.");
        return null;
      }
      const text = readNetworkText(await res.text());
      if (!text) {
        setNetworkState("fallback", "Infinity AI returned an empty reply; offline tools are active.");
        return null;
      }
      setNetworkState("connected", "Infinity AI connected");
      return text;
    } catch (error) {
      const reason = error && error.name === "AbortError" ? "Infinity AI timed out" : "Infinity AI could not be reached";
      setNetworkState("fallback", reason + "; offline tools are active.");
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  /* ─────────────────────────────────────────────────────────────
     CHROME BUILT-IN AI (Gemini Nano) — secondary fallback
     Tries window.LanguageModel (Chrome 131+) then the older
     window.ai.languageModel shim. Falls back silently.
     ──────────────────────────────────────────────────────────── */

  let _aiSession      = null;   /* Chrome AI session */
  let _aiReady        = false;  /* true once session confirmed working */
  let _aiInitPending  = false;
  let _convHistory    = [];     /* [{role:"user"|"assistant", text}] */
  let _currentContext = null;   /* {show, episode} being watched right now */
  let _popInTimers    = [];     /* setTimeout handles for watch-along pop-ins */

  const CONV_KEY          = "starquest_cosmo_conv";
  const MAX_CONV_HISTORY  = 24;  /* maximum stored conversation turns */

  function saveConvHistory() {
    try { localStorage.setItem(CONV_KEY, JSON.stringify(_convHistory)); } catch (_) {}
  }

  function loadConvHistory() {
    try {
      const raw = localStorage.getItem(CONV_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) _convHistory = parsed.slice(-MAX_CONV_HISTORY);
      }
    } catch (_) {}
  }

  /* Compact catalogue description for the system prompt */
  function buildCatalogueBlurb() {
    if (typeof SHOWS === "undefined") return "";
    const sample = SHOWS.slice(0, 30).map((s) =>
      `${s.title} (${s.years}, ${s.genre.join("/")})`
    ).join("; ");
    return "StarQuest catalogue includes: " + sample + (SHOWS.length > 30 ? " and more." : ".");
  }

  /* Build a summary of user watch history for the system prompt */
  function buildHistoryBlurb() {
    if (typeof StarQuestAuth === "undefined") return "";
    const history = StarQuestAuth.getHistory();
    if (!history || !history.length) return "";
    /* Count genre preferences */
    const genreCounts = {};
    const watchedShows = new Set();
    history.forEach((item) => {
      watchedShows.add(item.showTitle);
      if (typeof SHOWS !== "undefined") {
        const show = SHOWS.find((s) => s.title.toLowerCase() === (item.showTitle || "").toLowerCase());
        if (show && show.genre) {
          show.genre.forEach((g) => { genreCounts[g] = (genreCounts[g] || 0) + 1; });
        }
      }
    });
    const topGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map((e) => e[0]);
    const recentShows = Array.from(watchedShows).slice(0, 5);
    return (
      "\nUser watch history: They've watched " + recentShows.join(", ") + "." +
      (topGenres.length ? " Top genre preferences: " + topGenres.join(", ") + "." : "") +
      " When recommending, prioritize shows matching these genres and avoid shows they've already watched."
    );
  }

  function buildSystemPrompt() {
    const cat = buildCatalogueBlurb();
    const hist = buildHistoryBlurb();
    const ctx = _currentContext
      ? `\nThe user is currently watching: ${_currentContext.show} — "${_currentContext.episode}".`
      : "";
    return (
      "You are Cosmo, the AI companion for StarQuest — a free classic TV & movies streaming site featuring 1950s–1990s content from archive.org.\n" +
      "You are a knowledgeable, warm viewing companion. Speak naturally and specifically, usually in 2-5 sentences. Do not repeat stock catchphrases.\n" +
      "You never give robotic encyclopedia entries. You never make up episode timestamps, prices, availability, products, or facts.\n" +
      "Never claim to read thoughts, minds, other tabs, browser history, private messages, or inaccessible video. Never claim actors, filmmakers, a movie, or Hollywood are reacting to the viewer personally. Treat a program's content and the viewer's private life as separate unless the viewer supplies a concrete connection.\n" +
      "For watch-along remarks, use only the supplied title, playback time, caption text, verified lookup, and viewer-controlled StarQuest interest signals. If that evidence cannot support a useful specific comment, return exactly NO_COMMENT.\n" +
      "Treat fetched movie summaries and source URLs as evidence. If you are unsure, say so and offer to look it up.\n" +
      "When recommending shows, always reference specific titles from the StarQuest catalogue and explain WHY based on what the user has watched.\n" +
      "Commercial suggestions are allowed only when StarQuest marks them as enabled and relevant. Always label them as sponsored, never use hidden or subliminal persuasion, never claim urgency you cannot verify, and never say an order was placed without separate viewer confirmation.\n" +
      "StarCoins are created from completed sharing: each share adds 1/10 and the 10th creates one coin. Watch time never mints StarCoins.\n" +
      cat + hist + ctx +
      (global.StarQuestCosmoContext ? global.StarQuestCosmoContext.promptContext() : "") +
      (global.StarQuestCosmoLive ? global.StarQuestCosmoLive.contextBlurb() + global.StarQuestCosmoLive.preferenceBlurb() : "")
    );
  }

  async function initChromeAI() {
    if (_aiInitPending || _aiReady) return;
    _aiInitPending = true;
    try {
      /* Try new Chrome 131+ API */
      if (typeof LanguageModel !== "undefined") {
        const avail = await LanguageModel.availability();
        if (avail === "readily" || avail === "after-download") {
          _aiSession = await LanguageModel.create({ systemPrompt: buildSystemPrompt() });
          _aiReady = true;
          _notifyAIReady();
          return;
        }
      }
      /* Try older window.ai shim (Chrome 127–130) */
      if (window.ai && window.ai.languageModel) {
        const caps = await window.ai.languageModel.capabilities();
        if (caps.available === "readily" || caps.available === "after-download") {
          _aiSession = await window.ai.languageModel.create({ systemPrompt: buildSystemPrompt() });
          _aiReady = true;
          _notifyAIReady();
        }
      }
    } catch (_) {
      /* Chrome AI unavailable — silent fallback to rule-based */
    } finally {
      _aiInitPending = false;
    }
  }

  function _notifyAIReady() {
    document.dispatchEvent(new CustomEvent("starquest:ai-ready"));
  }

  /* Rebuild session when context changes (new show opened) */
  async function _rebuildSession() {
    if (!_aiReady) return;
    try {
      if (typeof LanguageModel !== "undefined") {
        _aiSession = await LanguageModel.create({ systemPrompt: buildSystemPrompt() });
      } else if (window.ai && window.ai.languageModel) {
        _aiSession = await window.ai.languageModel.create({ systemPrompt: buildSystemPrompt() });
      }
    } catch (_) { _aiReady = false; }
  }

  /* Prompt Chrome AI with conversation history injected as context */
  async function _promptAI(userMessage) {
    if (!_aiSession) return null;
    /* Build a brief history prefix so the model has context */
    const historyText = _convHistory.slice(-8).map((m) =>
      (m.role === "user" ? "User: " : "Cosmo: ") + m.text
    ).join("\n");
    const fullPrompt = historyText ? historyText + "\nUser: " + userMessage : userMessage;
    try {
      const result = await _aiSession.prompt(fullPrompt);
      return result ? result.trim() : null;
    } catch (_) {
      _aiReady = false;
      return null;
    }
  }

  async function generatePopInText(showId, showTitle, epTitle) {
    const offer = global.StarQuestCosmoLive && global.StarQuestCosmoLive.sponsoredSuggestion();
    if (offer) return `${offer.label}: ${offer.text} ${offer.url}`;
    const userPrompt = `Generate ONE specific watch-along insight (up to 2 short sentences) for "${showTitle}" — episode "${epTitle}". Connect the current verified playback/caption evidence to the viewer-controlled weighted interests only when the connection is supported. Do not use generic scene commentary. If there is not enough evidence, return exactly NO_COMMENT.`;
    if (global.StarQuestGemma && global.StarQuestGemma.status().ready) {
      const gemmaResponse = await global.StarQuestGemma.prompt(buildSystemPrompt() + "\n" + userPrompt);
      if (gemmaResponse && !/^NO_COMMENT\.?$/i.test(gemmaResponse.trim())) return gemmaResponse;
    }
    /* Network fallback */
    const pollinResponse = await _callNetworkAI([
      { role: "system", content: buildSystemPrompt() },
      { role: "user",   content: userPrompt },
    ]);
    if (pollinResponse && !/^NO_COMMENT\.?$/i.test(pollinResponse.trim())) return pollinResponse;
    /* Chrome AI fallback */
    if (_aiReady && _aiSession) {
      const ai = await _promptAI(userPrompt);
      if (ai && !/^NO_COMMENT\.?$/i.test(ai.trim())) return ai;
    }
    return null;
  }

  let _infinityLanguageEngine = null;
  let _infinitySiteBus = null;
  let _infinityCatalogueLoaded = false;

  function infinityLanguageEngine() {
    if (!global.InfinityAIKernel) return null;
    if (!_infinityLanguageEngine) _infinityLanguageEngine = new global.InfinityAIKernel.InfinityLanguageEngine();
    if (!_infinityCatalogueLoaded && typeof SHOWS !== "undefined") {
      _infinityLanguageEngine.addDocuments(SHOWS.map((show) => ({
        id: "starquest-show:" + show.id,
        title: show.title,
        tags: [].concat(show.genre || [], show.years || "", "StarQuest catalogue"),
        text: show.title + " (" + (show.years || "year unknown") + ") is a StarQuest " +
          [].concat(show.genre || []).join("/") + " title. " + String(show.description || "") +
          " StarQuest score: " + String(show.score || "unrated") + "."
      })));
      _infinityCatalogueLoaded = true;
    }
    return _infinityLanguageEngine;
  }

  function infinityLanguageResponse(question) {
    const engine = infinityLanguageEngine();
    if (!engine) return null;
    const result = engine.answer(question, { site: "STARQUEST", playback: _currentContext });
    return result.confidence >= 0.55 ? result.text : null;
  }

  function isCatalogueQuestion(question) {
    const text = normalize(question);
    if (/\b(show|movie|film|episode|season|actor|actress|cast|director|watch|recommend|starquest|archive|genre|comedy|drama|sci fi|crime|cartoon|television|tv)\b/.test(text)) return true;
    if (typeof SHOWS === "undefined") return false;
    return SHOWS.some((show) => {
      const title = normalize(show.title);
      return title.length >= 4 && text.includes(title);
    });
  }

  function publishInfinitySiteEvent(type, payload) {
    if (!global.InfinityAIKernel) return;
    if (!_infinitySiteBus) _infinitySiteBus = new global.InfinityAIKernel.InfinitySiteBus();
    const suffix = (payload && (payload.showId || payload.title)) || "event";
    _infinitySiteBus.append({
      eventId: "starquest:" + String(type).toLowerCase() + ":" + Date.now() + ":" + String(suffix).replace(/[^a-z0-9]+/gi, "-"),
      type,
      sourceSite: "STARQUEST",
      payload: payload || {}
    }).then((event) => {
      const engine = infinityLanguageEngine();
      if (engine) engine.learnFromEvent(event);
    }).catch(() => {});
  }

  /* ─────────────────────────────────────────────────────────────
     MAIN CHAT FUNCTION
     Returns a Promise<string> always.
     ──────────────────────────────────────────────────────────── */

  async function chat(userMessage) {
    document.dispatchEvent(new CustomEvent("starquest:cosmo-user-message", {
      detail: { text: String(userMessage || "") }
    }));
    if (global.StarQuestCosmoLive) {
      global.StarQuestCosmoLive.remember(userMessage);
      const listResponse = global.StarQuestCosmoLive.handleListIntent(userMessage);
      if (listResponse) {
        _convHistory.push({ role: "user", text: userMessage }, { role: "assistant", text: listResponse });
        _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
        saveConvHistory();
        return listResponse;
      }
    }

    /* Greetings and identity questions are answered immediately on every device. */
    const quickQuestion = normalize(userMessage);
    if (/^(hi|hello|hey|howdy|sup|yo|greetings)\b/.test(quickQuestion) ||
        quickQuestion.includes("who are you") || quickQuestion.includes("your name")) {
      const quickResponse = generateResponse(userMessage);
      _convHistory.push({ role: "user", text: userMessage }, { role: "assistant", text: quickResponse });
      _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
      saveConvHistory();
      return quickResponse;
    }

    if (global.StarQuestCatalogLedger && /ledger|rights|license|paid|payout|computer.*watch|rewatch/.test(quickQuestion)) {
      const ledger = global.StarQuestCatalogLedger.summary();
      const ledgerResponse = "🧾 StarQuest has ledger records for " + ledger.titlesLedgered +
        " titles and " + ledger.episodes + " episodes. " + ledger.authorizedAnalysisQueued +
        " episodes are authorized for automated analysis, " + ledger.rightsReviewHeld +
        " are held for rights review, and " + ledger.sourceBlocked +
        " have a blocked source. Each unique authorized Cosmo scan can create one provisional Infinity accrual; " +
        ledger.provisionalInfinityAccrued + " are currently accrued. A repeat scan with the same source fingerprint creates no duplicate credit. " +
        "The scan is not counted as a human impression. A real deposit still requires an active rights contract, funded approval, and a transaction reference; this browser reports " + ledger.payoutsCompleted + " completed payouts.";
      _convHistory.push({ role: "user", text: userMessage }, { role: "assistant", text: ledgerResponse });
      _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
      saveConvHistory();
      return ledgerResponse;
    }

    /* 1. Use the viewer-started local Gemma model when ready. */
    if (global.StarQuestGemma && global.StarQuestGemma.status().ready) {
      const gemmaResponse = await global.StarQuestGemma.prompt(buildSystemPrompt() + "\nUser: " + userMessage);
      if (gemmaResponse) {
        _convHistory.push({ role: "user", text: userMessage }, { role: "assistant", text: gemmaResponse });
        _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
        saveConvHistory();
        return gemmaResponse;
      }
    }

    /* 2. Real network AI handles open conversation before any fuzzy catalogue lookup. */
    const pollinResponse = await _callNetworkAI(buildMessages(userMessage));
    if (pollinResponse) {
      _convHistory.push({ role: "user",      text: userMessage });
      _convHistory.push({ role: "assistant", text: pollinResponse });
      if (_convHistory.length > MAX_CONV_HISTORY) _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
      saveConvHistory();
      return pollinResponse;
    }

    /* 3. Try Chrome Built-in AI if available. */
    if (_aiReady && _aiSession) {
      const aiResponse = await _promptAI(userMessage);
      if (aiResponse) {
        _convHistory.push({ role: "user",      text: userMessage });
        _convHistory.push({ role: "assistant", text: aiResponse });
        if (_convHistory.length > MAX_CONV_HISTORY) _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
        saveConvHistory();
        return aiResponse;
      }
    }

    /* 4. Use the shared Infinity catalogue engine only for relevant media questions. */
    if (isCatalogueQuestion(userMessage)) {
      const infinityResponse = infinityLanguageResponse(userMessage);
      if (infinityResponse) {
        _convHistory.push({ role: "user", text: userMessage }, { role: "assistant", text: infinityResponse });
        _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
        saveConvHistory();
        return infinityResponse;
      }
    }

    /* 5. Live sourced answer before the offline knowledge fallback. */
    if (global.StarQuestCosmoLive) {
      const sourced = global.StarQuestCosmoLive.answerFromLiveContext(userMessage);
      if (sourced) {
        _convHistory.push({ role: "user", text: userMessage }, { role: "assistant", text: sourced });
        _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
        saveConvHistory();
        return sourced;
      }
    }

    /* 6. Rule-based fallback — basic chat still works offline. */
    const response = generateResponse(userMessage);
    _convHistory.push({ role: "user",      text: userMessage });
    _convHistory.push({ role: "assistant", text: response });
    if (_convHistory.length > MAX_CONV_HISTORY) _convHistory = _convHistory.slice(-MAX_CONV_HISTORY);
    saveConvHistory();
    return response;
  }

  async function suggestDesignName(target, currentValue) {
    const messages = [
      { role: "system", content: "You are a concise interface naming designer. Return only one short replacement label, 2 to 5 words, with no quotes, explanation, trademark symbol, or punctuation at the end." },
      { role: "user", content: "Create a fresh label for this StarQuest interface element. Element: " + String(target || "interface") + ". Current label: " + String(currentValue || "").slice(0, 80) }
    ];
    const suggestion = await _callNetworkAI(messages);
    if (!suggestion) return null;
    return suggestion.replace(/["'`]/g, "").split(/\r?\n/)[0].trim().slice(0, 64) || null;
  }

  /* ── Public API ── */
  global.StarQuestAI = {
    /** Call once on page load to attempt Chrome AI init (secondary engine) */
    init: initChromeAI,

    isAIMode() {
      return !!((_aiReady && _aiSession) || (global.StarQuestGemma && global.StarQuestGemma.status().ready));
    },

    async startGemma() {
      if (!global.StarQuestGemma) return { state: "error", detail: "Gemma adapter did not load." };
      return global.StarQuestGemma.start(buildSystemPrompt());
    },

    /** Set currently-playing context so Cosmo knows what you're watching */
    setContext(showId, showTitle, epTitle) {
      _currentContext = { showId, show: showTitle, episode: epTitle || "" };
      if (global.StarQuestCosmoLive) global.StarQuestCosmoLive.setContext(_currentContext);
      publishInfinitySiteEvent("PLAYBACK_CONTEXT_SET", { showId, title: showTitle, episode: epTitle || "" });
      if (_aiReady) _rebuildSession();
    },

    /** Clear context when player closes */
    clearContext() {
      _currentContext = null;
      if (global.StarQuestCosmoLive) global.StarQuestCosmoLive.setContext(null);
    },

    updatePlayback(snapshot) {
      if (global.StarQuestCosmoLive) global.StarQuestCosmoLive.updatePlayback(snapshot);
    },

    /** Main chat entry point — always returns a Promise<string> */
    chat,

    /** Generate a pop-in comment for the current show */
    generatePopIn: generatePopInText,
    suggestDesignName,

    providerStatus() {
      const configured = !!networkEndpoint();
      return {
        state: configured ? _networkState : "unconfigured",
        provider: "infinity-ai",
        message: configured
          ? "Infinity AI gateway is configured."
          : "Live AI needs the secure Infinity gateway; offline tools remain available."
      };
    },

    /** Clear conversation memory (and localStorage) */
    clearHistory() {
      _convHistory = [];
      try { localStorage.removeItem(CONV_KEY); } catch (_) {}
    },

    /** Return a copy of the current conversation history */
    getHistory() { return _convHistory.slice(); },

    name: "Cosmo",
  };

  /* Auto-init on load */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loadConvHistory();
      /* Basic Cosmo is ready; richer engines report their own status. */
      document.dispatchEvent(new CustomEvent("starquest:ai-ready"));
      /* Also try Chrome Built-in AI as secondary engine */
      initChromeAI();
    });
  } else {
    loadConvHistory();
    document.dispatchEvent(new CustomEvent("starquest:ai-ready"));
    initChromeAI();
  }

})(window);
