/** StarQuest YouTube-only catalog gate.
 * Removes all non-YouTube episodes before the application, ledger, search,
 * recommendations, and player initialize. Curated movie replacements come
 * from the same checked channel catalogs used by the live Infinity channels.
 */
(function (global) {
  "use strict";

  const CURATED_MOVIES = [
  {
    "id": "MOV-001",
    "title": "The Phantom Planet",
    "year": 1961,
    "collection": "Atomic Sci-Fi",
    "runtimeSeconds": 4920,
    "videoId": "MqaN40sbap4",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-002",
    "title": "Things to Come",
    "year": 1936,
    "collection": "Future Worlds",
    "runtimeSeconds": 5820,
    "videoId": "22cOGjikPG8",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-003",
    "title": "Galaxy of Terror",
    "year": 1981,
    "collection": "Deep Space After Dark",
    "runtimeSeconds": 4860,
    "videoId": "JpRsqqGMFdE",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-004",
    "title": "The Amazing Transparent Man",
    "year": 1960,
    "collection": "Strange Science",
    "runtimeSeconds": 4680,
    "videoId": "OvJS9WFW7Uc",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-005",
    "title": "Attack from Space",
    "year": 1965,
    "collection": "Space Adventure",
    "runtimeSeconds": 3000,
    "videoId": "duc_edJQaxU",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-006",
    "title": "Phantom from Space",
    "year": 1953,
    "collection": "Alien Signal",
    "runtimeSeconds": 4380,
    "videoId": "SN8R3k73qj0",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-007",
    "title": "Missile to the Moon",
    "year": 1958,
    "collection": "Moon Mission",
    "runtimeSeconds": 4680,
    "videoId": "PkSlAmx_wnk",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-008",
    "title": "The Monster of Piedras Blancas",
    "year": 1959,
    "collection": "Creature Feature",
    "runtimeSeconds": 4740,
    "videoId": "SYKl4PtdPUA",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-009",
    "title": "The Santa Trap",
    "year": 2002,
    "collection": "Family Night",
    "runtimeSeconds": 5280,
    "videoId": "GJytAtSuEew",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-010",
    "title": "A Christmas Karen",
    "year": 2022,
    "collection": "Comedy Night",
    "runtimeSeconds": 5940,
    "videoId": "6nJ8n3MIiZY",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-011",
    "title": "A Room to Share",
    "year": 2024,
    "collection": "Romantic Comedy",
    "runtimeSeconds": 5400,
    "videoId": "8s7XqNWiTrw",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-012",
    "title": "Runs in the Family",
    "year": 2023,
    "collection": "Adventure Comedy",
    "runtimeSeconds": 6300,
    "videoId": "AuwUwN1JVec",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-013",
    "title": "Moving McAllister",
    "year": 2007,
    "collection": "Road Comedy",
    "runtimeSeconds": 5340,
    "videoId": "mVZOMXWsExs",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-014",
    "title": "Paper Man",
    "year": 2009,
    "collection": "Superhero Comedy",
    "runtimeSeconds": 6600,
    "videoId": "BDdyKWZrdng",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-015",
    "title": "Breakfast of Champions",
    "year": 1999,
    "collection": "Offbeat Comedy",
    "runtimeSeconds": 6600,
    "videoId": "uW9hO6pwjEs",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "MOV-016",
    "title": "Get Well Soon",
    "year": 2001,
    "collection": "Comedy Night",
    "runtimeSeconds": 5700,
    "videoId": "caB-B9ae1jQ",
    "cleared": true,
    "posterUrl": "",
    "channel": "Hermit TV"
  },
  {
    "id": "SL-001",
    "title": "Super Fuzz",
    "year": 1980,
    "collection": "80s Action Comedy",
    "runtimeSeconds": 6000,
    "videoId": "V9Fh3jqMZTk",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-002",
    "title": "Chopping Mall",
    "year": 1986,
    "collection": "80s Cult Sci-Fi",
    "runtimeSeconds": 4620,
    "videoId": "MglLwua-PLI",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-003",
    "title": "Far Out Man",
    "year": 1990,
    "collection": "Tommy Chong Comedy",
    "runtimeSeconds": 4860,
    "videoId": "rMl0rNThC6A",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-004",
    "title": "Black Fox",
    "year": 1995,
    "collection": "Christopher Reeve Action",
    "runtimeSeconds": 5520,
    "videoId": "GI2TFFWrBlc",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-005",
    "title": "No Contest",
    "year": 1995,
    "collection": "90s Action",
    "runtimeSeconds": 5880,
    "videoId": "KR2GQycoFFI",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-006",
    "title": "Fatal Combat",
    "year": 1995,
    "collection": "90s Arcade Action",
    "runtimeSeconds": 5520,
    "videoId": "0NOa-byFHaw",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-007",
    "title": "Hologram Man",
    "year": 1995,
    "collection": "90s Sci-Fi Action",
    "runtimeSeconds": 5940,
    "videoId": "FUO7e0E79Gk",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-008",
    "title": "The Misery Brothers",
    "year": 1995,
    "collection": "90s Comedy",
    "runtimeSeconds": 5580,
    "videoId": "Qy4rFtQti-M",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-009",
    "title": "Hotel Sorrento",
    "year": 1995,
    "collection": "90s Drama",
    "runtimeSeconds": 6600,
    "videoId": "IxGqHo8vqek",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-010",
    "title": "Chairman of the Board",
    "year": 1998,
    "collection": "Carrot Top Comedy",
    "runtimeSeconds": 5700,
    "videoId": "RvdAMAZT1KQ",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-011",
    "title": "Breakfast of Champions",
    "year": 1999,
    "collection": "Bruce Willis Comedy",
    "runtimeSeconds": 6600,
    "videoId": "uW9hO6pwjEs",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-012",
    "title": "Get Well Soon",
    "year": 2001,
    "collection": "Courteney Cox Comedy",
    "runtimeSeconds": 5700,
    "videoId": "caB-B9ae1jQ",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-013",
    "title": "Eulogy",
    "year": 2004,
    "collection": "All-Star Comedy",
    "runtimeSeconds": 5460,
    "videoId": "AY2jJ63ZB7k",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-014",
    "title": "Bob the Butler",
    "year": 2005,
    "collection": "Family Comedy",
    "runtimeSeconds": 5400,
    "videoId": "vLRK63m0m7Y",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-015",
    "title": "Moving McAllister",
    "year": 2007,
    "collection": "Road Comedy",
    "runtimeSeconds": 5340,
    "videoId": "mVZOMXWsExs",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-016",
    "title": "Paper Man",
    "year": 2009,
    "collection": "Superhero Comedy",
    "runtimeSeconds": 6600,
    "videoId": "BDdyKWZrdng",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "SL-017",
    "title": "Khumba",
    "year": 2013,
    "collection": "Animated Feature",
    "runtimeSeconds": 5100,
    "videoId": "tf7sVfOjWYU",
    "cleared": true,
    "posterUrl": "",
    "channel": "Star Launcher"
  },
  {
    "id": "HBO-001",
    "title": "Serenity",
    "year": 2005,
    "collection": "Space Epic",
    "runtimeSeconds": 7140,
    "videoId": "WPXS9UtDmyQ",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-002",
    "title": "Mean Girls",
    "year": 2004,
    "collection": "Modern Comedy Classic",
    "runtimeSeconds": 5820,
    "videoId": "HPkDFc8hq5c",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-003",
    "title": "Honest Thief",
    "year": 2020,
    "collection": "Prime-Time Action",
    "runtimeSeconds": 5940,
    "videoId": "BqluXcZ9RyU",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-004",
    "title": "World Trade Center",
    "year": 2006,
    "collection": "Prestige Drama",
    "runtimeSeconds": 7740,
    "videoId": "KVk4ATEGb8Q",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-005",
    "title": "Skyline",
    "year": 2010,
    "collection": "Science-Fiction Event",
    "runtimeSeconds": 5640,
    "videoId": "DXf-NpZuCZ8",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-006",
    "title": "Blitz",
    "year": 2011,
    "collection": "After-Hours Action",
    "runtimeSeconds": 5820,
    "videoId": "EMvIgNcej-w",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-007",
    "title": "Alone",
    "year": 2020,
    "collection": "Survival Thriller",
    "runtimeSeconds": 5880,
    "videoId": "69C1s6oMs64",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-008",
    "title": "Beyond a Reasonable Doubt",
    "year": 2009,
    "collection": "Courtroom Thriller",
    "runtimeSeconds": 6360,
    "videoId": "L9AQELWJkFA",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-009",
    "title": "Are You Here",
    "year": 2013,
    "collection": "Comedy Drama",
    "runtimeSeconds": 6840,
    "videoId": "6f2YlLBqclo",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-010",
    "title": "Mad Families",
    "year": 2017,
    "collection": "Weekend Comedy",
    "runtimeSeconds": 5400,
    "videoId": "8jyuUeCiWEk",
    "source": "YouTube Movies",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-011",
    "title": "The Fanatic",
    "year": 2019,
    "collection": "Midnight Thriller",
    "runtimeSeconds": 5280,
    "videoId": "9YcPkigDdqw",
    "source": "Quiver Distribution",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-012",
    "title": "Bromates",
    "year": 2022,
    "collection": "Late-Night Comedy",
    "runtimeSeconds": 5820,
    "videoId": "MTjKBwIhJ20",
    "source": "Quiver Distribution",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-013",
    "title": "The Presence",
    "year": 2010,
    "collection": "Supernatural Sunday",
    "runtimeSeconds": 6097,
    "videoId": "PsuWXuhy2VU",
    "source": "Movie Central",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "HBO-014",
    "title": "Monsters of Man",
    "year": 2020,
    "collection": "Future Shock",
    "runtimeSeconds": 7920,
    "videoId": "VZQmj6bH5cY",
    "source": "Movie Central",
    "networkChannel": "HBO",
    "cleared": true,
    "posterUrl": "",
    "channel": "HBO"
  },
  {
    "id": "MAX-001",
    "title": "Sneakers",
    "year": 1992,
    "collection": "Tech Caper",
    "runtimeSeconds": 7516,
    "videoId": "Qy9XYQBBIJ4",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-002",
    "title": "Stargate",
    "year": 1994,
    "collection": "Science-Fiction Adventure",
    "runtimeSeconds": 7268,
    "videoId": "lsuY5dYxOCs",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-003",
    "title": "Crouching Tiger, Hidden Dragon",
    "year": 2000,
    "collection": "Martial-Arts Epic",
    "runtimeSeconds": 7208,
    "videoId": "SAGdBlJrMSA",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-004",
    "title": "Clueless",
    "year": 1995,
    "collection": "Modern Comedy Classic",
    "runtimeSeconds": 5834,
    "videoId": "fajG1C0xj9c",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-005",
    "title": "The Longest Yard",
    "year": 2005,
    "collection": "Sports Action Comedy",
    "runtimeSeconds": 6808,
    "videoId": "uGJv_zSRiR0",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-006",
    "title": "Wanted",
    "year": 2008,
    "collection": "High-Impact Action",
    "runtimeSeconds": 6593,
    "videoId": "bdEqvgVSI2Y",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-007",
    "title": "Zodiac",
    "year": 2007,
    "collection": "Crime Investigation",
    "runtimeSeconds": 9459,
    "videoId": "ZNOHCuF1Vns",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-008",
    "title": "Payback",
    "year": 1999,
    "collection": "Neo-Noir Crime",
    "runtimeSeconds": 5201,
    "videoId": "naG_MI5dsbo",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-009",
    "title": "Ava",
    "year": 2020,
    "collection": "Assassin Thriller",
    "runtimeSeconds": 5821,
    "videoId": "CvZC1dy3LsQ",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-010",
    "title": "Assault on Precinct 13",
    "year": 2005,
    "collection": "Siege Thriller",
    "runtimeSeconds": 6525,
    "videoId": "mKqIlKhS0YE",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-011",
    "title": "The Fog",
    "year": 2005,
    "collection": "Supernatural After Dark",
    "runtimeSeconds": 5995,
    "videoId": "J2UYk9HPz28",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-012",
    "title": "Survivor",
    "year": 2015,
    "collection": "Conspiracy Action",
    "runtimeSeconds": 5799,
    "videoId": "fzfMsnqD-yM",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-013",
    "title": "Rage",
    "year": 2014,
    "collection": "Revenge Thriller",
    "runtimeSeconds": 5895,
    "videoId": "_MRTR3VGhfc",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "MAX-014",
    "title": "Stephen King's A Good Marriage",
    "year": 2014,
    "collection": "Psychological Thriller",
    "runtimeSeconds": 6093,
    "videoId": "VGW1ShX2_hU",
    "source": "YouTube Movies",
    "networkChannel": "Cinemax",
    "cleared": true,
    "posterUrl": "",
    "channel": "Cinemax"
  },
  {
    "id": "STZ-001",
    "title": "The Seeds",
    "year": 2024,
    "collection": "Supernatural Thriller",
    "runtimeSeconds": 6758,
    "videoId": "-KP8vE35DkU",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-002",
    "title": "Daddy's Divas",
    "year": 2022,
    "collection": "Family Comedy",
    "runtimeSeconds": 12723,
    "videoId": "3b9cORpA3cY",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-003",
    "title": "Deadly Obsession 2",
    "year": 2026,
    "collection": "Suspense Premiere",
    "runtimeSeconds": 5094,
    "videoId": "46E8wrlfeus",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-004",
    "title": "A Mother's Hope",
    "year": 2024,
    "collection": "Original Drama",
    "runtimeSeconds": 7055,
    "videoId": "8R7FmuaFNf0",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-005",
    "title": "Fated",
    "year": 2024,
    "collection": "Romantic Drama",
    "runtimeSeconds": 5543,
    "videoId": "BGRnVRpEjAA",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-006",
    "title": "Player",
    "year": 2024,
    "collection": "Contemporary Drama",
    "runtimeSeconds": 5232,
    "videoId": "QgFP4kkx9OQ",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-007",
    "title": "Fright",
    "year": 2024,
    "collection": "After-Dark Horror",
    "runtimeSeconds": 4847,
    "videoId": "XvdxnvOsy4U",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-008",
    "title": "Amy's F It List",
    "year": 2023,
    "collection": "Bucket-List Comedy",
    "runtimeSeconds": 4699,
    "videoId": "bMXEcbmkr9w",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-009",
    "title": "Wrong Numbers",
    "year": 2024,
    "collection": "Original Drama",
    "runtimeSeconds": 5385,
    "videoId": "f2jpuJpXJM4",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-010",
    "title": "Deadly Obsession",
    "year": 2024,
    "collection": "Thriller Premiere",
    "runtimeSeconds": 5645,
    "videoId": "fGs8GqQbuyI",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-011",
    "title": "Feet of Death",
    "year": 2024,
    "collection": "Creature Feature",
    "runtimeSeconds": 6391,
    "videoId": "jJ8ZLaJmpmQ",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-012",
    "title": "The Whip",
    "year": 2024,
    "collection": "Modern Heist",
    "runtimeSeconds": 4912,
    "videoId": "vboUAIibXPo",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-013",
    "title": "Sincerity",
    "year": 2025,
    "collection": "Faith and Hope",
    "runtimeSeconds": 5156,
    "videoId": "pG0w4nzq3nA",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "STZ-014",
    "title": "Unraveled",
    "year": 2025,
    "collection": "Love and Revenge",
    "runtimeSeconds": 4924,
    "videoId": "wfMT-N2pqQA",
    "source": "Indie Rights",
    "networkChannel": "Starz",
    "cleared": true,
    "posterUrl": "",
    "channel": "Starz"
  },
  {
    "id": "ENC-001",
    "title": "Masters of the Universe",
    "year": 1987,
    "collection": "Fantasy Adventure",
    "runtimeSeconds": 6346,
    "videoId": "NTG2PESRurY",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-002",
    "title": "UHF",
    "year": 1989,
    "collection": "Cult Comedy",
    "runtimeSeconds": 5833,
    "videoId": "uAiyO8oEG4E",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-003",
    "title": "Terminator 2: Judgment Day",
    "year": 1991,
    "collection": "Action Event",
    "runtimeSeconds": 8217,
    "videoId": "AmfdVc_QMbA",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-004",
    "title": "RoboCop",
    "year": 1987,
    "collection": "Robot Action Classic",
    "runtimeSeconds": 6196,
    "videoId": "ZHv_r0DfkD4",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-005",
    "title": "The Karate Kid",
    "year": 1984,
    "collection": "Feel-Good Classic",
    "runtimeSeconds": 7616,
    "videoId": "-slifyirmX0",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-006",
    "title": "The Dark Crystal",
    "year": 1982,
    "collection": "Fantasy World",
    "runtimeSeconds": 5596,
    "videoId": "4XMRm9igLGo",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-007",
    "title": "Labyrinth",
    "year": 1986,
    "collection": "Fantasy Adventure",
    "runtimeSeconds": 6072,
    "videoId": "lL_Q0VtrTxU",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-008",
    "title": "Bill & Ted's Excellent Adventure",
    "year": 1989,
    "collection": "Time-Travel Comedy",
    "runtimeSeconds": 5390,
    "videoId": "a72W8hP9QNE",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-009",
    "title": "Bill & Ted's Bogus Journey",
    "year": 1991,
    "collection": "Afterlife Adventure",
    "runtimeSeconds": 5633,
    "videoId": "2nwyLnPj6SI",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-010",
    "title": "Highlander: The Final Dimension",
    "year": 1994,
    "collection": "Immortal Action",
    "runtimeSeconds": 5950,
    "videoId": "-RaNjt3NJw8",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-011",
    "title": "Waiting for Guffman",
    "year": 1996,
    "collection": "Comedy Favorite",
    "runtimeSeconds": 5019,
    "videoId": "9mdSMAmzo34",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-012",
    "title": "Return of the Living Dead Part II",
    "year": 1988,
    "collection": "Horror Comedy",
    "runtimeSeconds": 5359,
    "videoId": "J-52ztSF-8A",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-013",
    "title": "Michael Collins",
    "year": 1996,
    "collection": "Epic Drama",
    "runtimeSeconds": 7944,
    "videoId": "KMwQDqiHCAQ",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  },
  {
    "id": "ENC-014",
    "title": "Deathtrap",
    "year": 1982,
    "collection": "Mystery Classic",
    "runtimeSeconds": 6968,
    "videoId": "t9w1izfm9qI",
    "source": "YouTube Movies",
    "networkChannel": "Encore",
    "cleared": true,
    "posterUrl": "",
    "channel": "Encore"
  }
];

  const SAFE_CURATED_TITLES = new Set([
    "the phantom planet", "things to come", "the amazing transparent man", "attack from space",
    "phantom from space", "missile to the moon", "the monster of piedras blancas",
    "the santa trap", "a christmas karen", "a room to share", "runs in the family",
    "moving mcallister", "super fuzz", "black fox", "chairman of the board", "bob the butler",
    "khumba", "honest thief", "world trade center", "skyline", "beyond a reasonable doubt",
    "mad families", "sneakers", "stargate", "crouching tiger, hidden dragon", "clueless",
    "the longest yard", "survivor", "masters of the universe", "uhf", "the karate kid",
    "the dark crystal", "labyrinth", "bill & ted's excellent adventure",
    "bill & ted's bogus journey", "highlander: the final dimension"
  ]);

  function nonAdultRating(value) {
    return !/^(R|NC-17|TV-MA)$/i.test(String(value || "").trim());
  }

  function safeExistingShow(show) {
    return show && nonAdultRating(show.rating || show.contentRating) &&
      !/galaxy of terror|chopping mall|fatal combat|hologram man|breakfast of champions|eulogy|blitz|the fanatic|the presence|monsters of man|wanted|zodiac|payback|\bava\b|assault on precinct 13|the fog|\brage\b|a good marriage|return of the living dead|michael collins|deathtrap/i.test(String(show.title || ""));
  }

  function validVideoId(value) {
    return /^[A-Za-z0-9_-]{11}$/.test(String(value || ""));
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/\s*(?:available|watch|stream)(?:\s+free)?\s+(?:at|on|from)\s+(?:the\s+)?Internet Archive\.?/gi, "")
      .replace(/\s*Internet Archive\.?/gi, "")
      .trim();
  }

  function genresFor(collection) {
    const text = String(collection || "").toLowerCase();
    const genres = [];
    if (/sci|space|future|alien|robot|atomic/.test(text)) genres.push("Sci-Fi");
    if (/action|combat|martial|adventure|war|western/.test(text)) genres.push("Action");
    if (/comedy|funny|family/.test(text)) genres.push("Comedy");
    if (/crime|caper|gangster|mystery|detective/.test(text)) genres.push("Crime");
    if (/thriller|suspense|horror|supernatural/.test(text)) genres.push("Thriller");
    if (/drama|romance|love|prestige/.test(text)) genres.push("Drama");
    if (/animation|animated|kids/.test(text)) genres.push("Family");
    return genres.length ? Array.from(new Set(genres)) : ["Movies"];
  }

  const existing = (typeof SHOWS !== "undefined" && Array.isArray(SHOWS) ? SHOWS : [])
    .filter(safeExistingShow)
    .filter((show) => {
      const cost = Number.isFinite(Number(show.starCoinCost))
        ? Math.max(0, Math.trunc(Number(show.starCoinCost)))
        : (show.payToWatch ? 1 : 0);
      return cost === 0;
    })
    .map((show) => {
      const episodes = (show.episodes || []).filter((episode) => {
        if (!validVideoId(episode.youtubeId)) return false;
        const copy = [episode.title, episode.description, show.description].join(" ");
        return !/rent or buy|trailer|preview only/i.test(copy);
      }).map((episode) => {
        const clean = { ...episode };
        delete clean.archiveId;
        delete clean.archiveFile;
        delete clean.archiveRoot;
        clean.description = cleanText(clean.description);
        clean.thumbnail = "https://img.youtube.com/vi/" + clean.youtubeId + "/hqdefault.jpg";
        clean.source = "YouTube";
        return clean;
      });
      if (!episodes.length) return null;
      const cleanShow = { ...show, episodes };
      delete cleanShow.archiveId;
      delete cleanShow.archiveFile;
      delete cleanShow.archiveRoot;
      cleanShow.description = cleanText(cleanShow.description);
      cleanShow.thumbnail = episodes[0].thumbnail;
      cleanShow.source = "YouTube";
      return cleanShow;
    })
    .filter(Boolean);

  const seenVideoIds = new Set();
  existing.forEach((show) => show.episodes.forEach((episode) => seenVideoIds.add(episode.youtubeId)));

  const replacements = CURATED_MOVIES.filter((movie) => {
    if (!movie.cleared || !SAFE_CURATED_TITLES.has(String(movie.title || "").toLowerCase()) || !validVideoId(movie.videoId) || seenVideoIds.has(movie.videoId)) return false;
    seenVideoIds.add(movie.videoId);
    return true;
  }).map((movie, index) => {
    const minutes = Math.max(1, Math.round(Number(movie.runtimeSeconds || 0) / 60));
    const slug = String(movie.channel + "-" + movie.id).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const thumbnail = "https://img.youtube.com/vi/" + movie.videoId + "/hqdefault.jpg";
    return {
      id: "youtube-" + slug,
      title: movie.title,
      years: String(movie.year || ""),
      type: "movie",
      rating: movie.rating || "Not rated / screened",
      score: 8 - ((index % 7) / 10),
      genre: genresFor(movie.collection),
      description: String(movie.collection || "Full-length movie") + " · YouTube selection from " + movie.channel + ".",
      thumbnail,
      source: "YouTube",
      episodes: [{
        id: "youtube-" + slug + "-full",
        title: movie.title,
        season: 0,
        episode: 1,
        year: Number(movie.year || 0),
        duration: minutes + " min",
        description: "Full-length YouTube feature selected for StarQuest from " + movie.channel + ".",
        youtubeId: movie.videoId,
        thumbnail,
        source: "YouTube"
      }]
    };
  });

  if (typeof SHOWS !== "undefined" && Array.isArray(SHOWS)) {
    SHOWS.splice(0, SHOWS.length, ...existing, ...replacements);
  }

  global.StarQuestYouTubeCatalog = Object.freeze({
    provider: "YouTube",
    shows: existing.length + replacements.length,
    replacements: replacements.length,
    filteredAt: new Date().toISOString()
  });
})(window);
