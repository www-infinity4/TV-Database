/**
 * StarQuest — AI Companion (Rule-based SLM)
 * A fully client-side knowledge base about the shows, movies, and TV history
 * in the StarQuest catalogue. No external API required.
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
        "You earn ⭐ StarCoins by watching (1 coin per hour) and sharing shows (1 coin per 10 shares). Your coins will unlock Pay-Per-View premium content coming soon!",
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
        if (q.includes(titleNorm) || titleNorm.includes(q)) {
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
      const picks = [
        "🌟 Due South — A charming Canadian Mountie in Chicago. Perfect for mystery-comedy fans!",
        "👻 The Real Ghostbusters — Better than the movie? Many fans think so! Smart writing for all ages.",
        "🚀 X-Men: The Animated Series — The definitive X-Men story. Tackles real-world prejudice through superheroes.",
        "🕵️ The New Alfred Hitchcock Presents — Masterful suspense anthology. Each episode is a mini-thriller.",
        "🌲 Northern Exposure — Philosophical, funny, and deeply human. TV's best-kept secret.",
        "👾 Ghostbusters (1984) — The original and still unbeaten comedy-horror classic.",
        "🎭 Columbo — The greatest TV detective ever. 'Just one more thing…'",
      ];
      return (
        "Here are some StarQuest picks for you:\n\n" +
        picks.slice(0, 3).join("\n") +
        "\n\n💡 Ask me about any show for more details!"
      );
    }

    /* Mario / theme */
    if (q.includes("mario") || q.includes("theme") || q.includes("nintendo")) {
      return "🍄 StarQuest rocks a Mario-inspired theme because finding your favorite star should feel like grabbing a Super Star — unstoppable and exciting! The theme gives you that 1980s arcade energy while you browse classics from the same era. More themes coming soon!";
    }

    /* StarQuest what/why */
    if (q.includes("starquest") || (q.includes("what") && q.includes("this"))) {
      return "⭐ StarQuest is your personal classic TV & movie streaming galaxy! We focus on 1950s–1990s content from the public domain and archive.org. Watch free, earn StarCoins for watching and sharing, and eventually unlock premium pay-per-view content. It's like the video rental store of the 90s — but better!";
    }

    /* Fallback with a show trivia */
    if (typeof SHOWS !== "undefined" && SHOWS.length) {
      const rShow = SHOWS[Math.floor(Math.random() * Math.min(15, SHOWS.length))];
      return (
        pickRandom(KNOWLEDGE.unknown) +
        `\n\n💡 Random fact: Did you know ${rShow.title} (${rShow.years}) has a score of ★ ${rShow.score}? Ask me about it!`
      );
    }
    return pickRandom(KNOWLEDGE.unknown);
  }

  /* ── Public API ── */
  global.StarQuestAI = {
    chat: generateResponse,
    name: KNOWLEDGE.personality.name,
  };
})(window);
