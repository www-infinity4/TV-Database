/**
 * TV Show & Episode Database — Classic Television 1970–2000
 * Content is sourced from publicly available archives.
 */

const SHOWS = [
  /* ────────────────────────────────────────────────────────────
     DUE SOUTH  (1994–1998)
     Archive identifier: due-south-1994-98
     Individual episodes addressed via the ?index= playlist param.
     Pilot = index 0; Season 1 episodes = index 1–22, etc.
     ──────────────────────────────────────────────────────────── */
  {
    id: "due-south",
    title: "Due South",
    years: "1994–1998",
    genre: ["Drama", "Comedy", "Crime"],
    rating: "TV-PG",
    score: 8.2,
    description:
      "A straight-laced Canadian Mountie, Constable Benton Fraser, is posted to the Canadian Consulate in Chicago where he teams up with the rough-around-the-edges Det. Ray Vecchio to solve crimes with charm, integrity, and a deaf wolf.",
    thumbnail: "https://archive.org/services/img/due-south-1994-98",
    featured: true,
    episodes: [
      /* ── Pilot ── */
      {
        id: "ds-s00e01", title: "Pilot", season: 0, episode: 1,
        year: 1994, duration: "90 min",
        description: "Mountie Benton Fraser arrives in Chicago to investigate his father's death and ends up teaming with Det. Ray Vecchio.",
        archiveId: "due-south-1994-98", archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      /* ── Season 1 ── */
      {
        id: "ds-s01e01", title: "Free Willie", season: 1, episode: 1,
        year: 1994, duration: "47 min",
        description: "Fraser helps free a wrongly convicted man and uncovers a corporate cover-up.",
        archiveId: "due-south-1994-98", archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e02", title: "Diefenbaker's Day Off", season: 1, episode: 2,
        year: 1994, duration: "47 min",
        description: "Diefenbaker, Fraser's deaf wolf, witnesses a murder while Fraser is stuck at the Consulate.",
        archiveId: "due-south-1994-98", archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e03", title: "Manhunt", season: 1, episode: 3,
        year: 1994, duration: "47 min",
        description: "Fraser tracks a fugitive from his past across Chicago.",
        archiveId: "due-south-1994-98", archiveIndex: 3,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e04", title: "They Eat Horses, Don't They?", season: 1, episode: 4,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio investigate the theft of a prize racehorse.",
        archiveId: "due-south-1994-98", archiveIndex: 4,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e05", title: "Pizzas and Promises", season: 1, episode: 5,
        year: 1994, duration: "47 min",
        description: "A seemingly routine pizza delivery turns into a case involving the mob.",
        archiveId: "due-south-1994-98", archiveIndex: 5,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e06", title: "Chinatown", season: 1, episode: 6,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio are drawn into Chicago's Chinatown to solve a kidnapping.",
        archiveId: "due-south-1994-98", archiveIndex: 6,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e07", title: "Chicago Holiday (Part 1)", season: 1, episode: 7,
        year: 1994, duration: "47 min",
        description: "Fraser escorts a European princess around Chicago, unaware that assassins are on her trail.",
        archiveId: "due-south-1994-98", archiveIndex: 7,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e08", title: "Chicago Holiday (Part 2)", season: 1, episode: 8,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio race to protect the princess from the assassins closing in on her.",
        archiveId: "due-south-1994-98", archiveIndex: 8,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e09", title: "A Cop, a Mountie and a Baby", season: 1, episode: 9,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio must look after an abandoned baby while solving a case.",
        archiveId: "due-south-1994-98", archiveIndex: 9,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e10", title: "The Gift of the Wheelman", season: 1, episode: 10,
        year: 1994, duration: "47 min",
        description: "A getaway driver seeks Fraser's help after becoming involved in a bank robbery.",
        archiveId: "due-south-1994-98", archiveIndex: 10,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e11", title: "You Must Remember This", season: 1, episode: 11,
        year: 1994, duration: "47 min",
        description: "A woman with amnesia holds the key to a dangerous secret.",
        archiveId: "due-south-1994-98", archiveIndex: 11,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e12", title: "A Hawk and a Handsaw", season: 1, episode: 12,
        year: 1994, duration: "47 min",
        description: "Fraser is involuntarily committed to a psychiatric hospital and must unravel a plot from within.",
        archiveId: "due-south-1994-98", archiveIndex: 12,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e13", title: "An Eye for an Eye", season: 1, episode: 13,
        year: 1994, duration: "47 min",
        description: "Fraser investigates a case of apparent vigilante justice in a neighbourhood under siege.",
        archiveId: "due-south-1994-98", archiveIndex: 13,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e14", title: "The Man Who Knew Too Little", season: 1, episode: 14,
        year: 1994, duration: "47 min",
        description: "An innocent bystander witnesses a crime but doesn't realise what he saw.",
        archiveId: "due-south-1994-98", archiveIndex: 14,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e15", title: "The Wild Bunch", season: 1, episode: 15,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio tangle with a gang of elderly bank robbers.",
        archiveId: "due-south-1994-98", archiveIndex: 15,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e16", title: "The Blue Line", season: 1, episode: 16,
        year: 1994, duration: "47 min",
        description: "An NHL hockey player is implicated in a crime and Fraser uses his knowledge of the game to help.",
        archiveId: "due-south-1994-98", archiveIndex: 16,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e17", title: "The Deal", season: 1, episode: 17,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio must negotiate a dangerous hostage situation.",
        archiveId: "due-south-1994-98", archiveIndex: 17,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e18", title: "An Invitation to Romance", season: 1, episode: 18,
        year: 1994, duration: "47 min",
        description: "Fraser's courtly manners attract the attention of a lonely widow hiding a dark secret.",
        archiveId: "due-south-1994-98", archiveIndex: 18,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e19", title: "Heaven and Earth", season: 1, episode: 19,
        year: 1995, duration: "47 min",
        description: "Fraser receives a spiritual visit and must solve a decades-old murder mystery.",
        archiveId: "due-south-1994-98", archiveIndex: 19,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e20", title: "Victoria's Secret (Part 1)", season: 1, episode: 20,
        year: 1995, duration: "47 min",
        description: "A woman from Fraser's past resurfaces in Chicago, reopening old wounds and old cases.",
        archiveId: "due-south-1994-98", archiveIndex: 20,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e21", title: "Victoria's Secret (Part 2)", season: 1, episode: 21,
        year: 1995, duration: "47 min",
        description: "Fraser's loyalty is torn between his duty and the woman he once loved.",
        archiveId: "due-south-1994-98", archiveIndex: 21,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s01e22", title: "Letting Go", season: 1, episode: 22,
        year: 1995, duration: "47 min",
        description: "Fraser struggles to move on in the aftermath of Victoria's departure.",
        archiveId: "due-south-1994-98", archiveIndex: 22,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      /* ── Season 2 ── */
      {
        id: "ds-s02e01", title: "North", season: 2, episode: 1,
        year: 1995, duration: "47 min",
        description: "Fraser heads north to investigate a murder in Canada's wilderness.",
        archiveId: "due-south-1994-98", archiveIndex: 23,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e02", title: "Vault", season: 2, episode: 2,
        year: 1995, duration: "47 min",
        description: "Fraser and Vecchio are trapped inside a bank vault during a robbery.",
        archiveId: "due-south-1994-98", archiveIndex: 24,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e03", title: "The Witness", season: 2, episode: 3,
        year: 1995, duration: "47 min",
        description: "A key witness to a mob killing needs protection and only Fraser can provide it.",
        archiveId: "due-south-1994-98", archiveIndex: 25,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e04", title: "Bird in the Hand", season: 2, episode: 4,
        year: 1995, duration: "47 min",
        description: "A political assassination plot puts Fraser and Vecchio in the crosshairs.",
        archiveId: "due-south-1994-98", archiveIndex: 26,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e05", title: "The Promise", season: 2, episode: 5,
        year: 1995, duration: "47 min",
        description: "Fraser fulfils an old promise to a dying man, leading to unexpected danger.",
        archiveId: "due-south-1994-98", archiveIndex: 27,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e06", title: "The Mask", season: 2, episode: 6,
        year: 1995, duration: "47 min",
        description: "A stolen Native Canadian ceremonial mask becomes the centre of an international theft ring.",
        archiveId: "due-south-1994-98", archiveIndex: 28,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e07", title: "Juliet Is Bleeding", season: 2, episode: 7,
        year: 1995, duration: "47 min",
        description: "Vecchio's sister gets involved with a mob boss, forcing the team into a dangerous operation.",
        archiveId: "due-south-1994-98", archiveIndex: 29,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e08", title: "One Good Man", season: 2, episode: 8,
        year: 1995, duration: "47 min",
        description: "A politician's good intentions are exploited by those around him.",
        archiveId: "due-south-1994-98", archiveIndex: 30,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e09", title: "The Edge", season: 2, episode: 9,
        year: 1996, duration: "47 min",
        description: "Fraser confronts his own mortality after a near-death experience.",
        archiveId: "due-south-1994-98", archiveIndex: 31,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e10", title: "Starman", season: 2, episode: 10,
        year: 1996, duration: "47 min",
        description: "A high-profile astronaut is targeted by saboteurs and only Fraser sees through the deception.",
        archiveId: "due-south-1994-98", archiveIndex: 32,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e11", title: "We Are the Eggmen", season: 2, episode: 11,
        year: 1996, duration: "47 min",
        description: "An unusual case involving exotic eggs leads Fraser and Vecchio into a world of rare-animal smuggling.",
        archiveId: "due-south-1994-98", archiveIndex: 33,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e12", title: "Some Like It Red", season: 2, episode: 12,
        year: 1996, duration: "47 min",
        description: "Fraser goes undercover in the fashion world to catch a jewel thief.",
        archiveId: "due-south-1994-98", archiveIndex: 34,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e13", title: "White Men Can't Jump to Conclusions", season: 2, episode: 13,
        year: 1996, duration: "47 min",
        description: "A basketball charity event becomes the cover for a deadly scheme.",
        archiveId: "due-south-1994-98", archiveIndex: 35,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e14", title: "All the Queen's Horses", season: 2, episode: 14,
        year: 1996, duration: "47 min",
        description: "Fraser must prevent a hijacking of a train carrying the RCMP Musical Ride horses.",
        archiveId: "due-south-1994-98", archiveIndex: 36,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e15", title: "Body Language", season: 2, episode: 15,
        year: 1996, duration: "47 min",
        description: "A mute street artist communicates the only way he can — through art — to expose a killer.",
        archiveId: "due-south-1994-98", archiveIndex: 37,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e16", title: "The Duel", season: 2, episode: 16,
        year: 1996, duration: "47 min",
        description: "An honour dispute escalates into a life-or-death standoff.",
        archiveId: "due-south-1994-98", archiveIndex: 38,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e17", title: "Red, White or Blue", season: 2, episode: 17,
        year: 1996, duration: "47 min",
        description: "A retired spy's past catches up with him — and with Fraser.",
        archiveId: "due-south-1994-98", archiveIndex: 39,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s02e18", title: "Flashback", season: 2, episode: 18,
        year: 1996, duration: "47 min",
        description: "Fraser and Vecchio investigate a cold case using recovered memories.",
        archiveId: "due-south-1994-98", archiveIndex: 40,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      /* ── Season 3 ── */
      {
        id: "ds-s03e01", title: "Burning Down the House", season: 3, episode: 1,
        year: 1997, duration: "47 min",
        description: "In the season opener Fraser faces the aftermath of a conspiracy that shook the 27th District.",
        archiveId: "due-south-1994-98", archiveIndex: 41,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e02", title: "Eclipse", season: 3, episode: 2,
        year: 1997, duration: "47 min",
        description: "A solar eclipse coincides with a string of crimes that seem to defy explanation.",
        archiveId: "due-south-1994-98", archiveIndex: 42,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e03", title: "I Coulda Been a Defendant", season: 3, episode: 3,
        year: 1997, duration: "47 min",
        description: "Fraser finds himself on the wrong side of the law when he is accused of a crime.",
        archiveId: "due-south-1994-98", archiveIndex: 43,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e04", title: "Strange Bedfellows", season: 3, episode: 4,
        year: 1997, duration: "47 min",
        description: "Political rivals must cooperate to survive — and Fraser is the unlikely mediator.",
        archiveId: "due-south-1994-98", archiveIndex: 44,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e05", title: "Seeing Is Believing", season: 3, episode: 5,
        year: 1997, duration: "47 min",
        description: "Witnesses to a crime all report wildly different versions of events.",
        archiveId: "due-south-1994-98", archiveIndex: 45,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e06", title: "Bounty Hunter", season: 3, episode: 6,
        year: 1997, duration: "47 min",
        description: "A bounty hunter and Fraser clash over the retrieval of a fugitive.",
        archiveId: "due-south-1994-98", archiveIndex: 46,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e07", title: "Mountie & Soul", season: 3, episode: 7,
        year: 1997, duration: "47 min",
        description: "Fraser's sense of duty is tested when he must choose between regulation and justice.",
        archiveId: "due-south-1994-98", archiveIndex: 47,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e08", title: "Spy vs. Spy", season: 3, episode: 8,
        year: 1997, duration: "47 min",
        description: "Cold War secrets surface in Chicago when rival intelligence agents converge on the city.",
        archiveId: "due-south-1994-98", archiveIndex: 48,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e09", title: "Asylum", season: 3, episode: 9,
        year: 1997, duration: "47 min",
        description: "A defector seeks sanctuary at the Canadian Consulate, putting Fraser in a diplomatic minefield.",
        archiveId: "due-south-1994-98", archiveIndex: 49,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e10", title: "Perfect Strangers", season: 3, episode: 10,
        year: 1997, duration: "47 min",
        description: "Fraser and his new partner must work together despite their very different approaches.",
        archiveId: "due-south-1994-98", archiveIndex: 50,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e11", title: "Dead Guy Running", season: 3, episode: 11,
        year: 1997, duration: "47 min",
        description: "A man believed dead turns up alive — and very much in danger.",
        archiveId: "due-south-1994-98", archiveIndex: 51,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e12", title: "Mountie on the Bounty (Part 1)", season: 3, episode: 12,
        year: 1998, duration: "47 min",
        description: "Fraser and his partner chase a criminal onto a cargo ship bound for the open sea.",
        archiveId: "due-south-1994-98", archiveIndex: 52,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s03e13", title: "Mountie on the Bounty (Part 2)", season: 3, episode: 13,
        year: 1998, duration: "47 min",
        description: "Trapped at sea, Fraser must outwit the criminals and find a way back to shore.",
        archiveId: "due-south-1994-98", archiveIndex: 53,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      /* ── Season 4 ── */
      {
        id: "ds-s04e01", title: "Dr. Longball", season: 4, episode: 1,
        year: 1998, duration: "47 min",
        description: "A celebrity doctor's charity golf tournament turns deadly.",
        archiveId: "due-south-1994-98", archiveIndex: 54,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e02", title: "Easy Money", season: 4, episode: 2,
        year: 1998, duration: "47 min",
        description: "Fraser investigates a get-rich-quick scheme that is leaving victims in its wake.",
        archiveId: "due-south-1994-98", archiveIndex: 55,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e03", title: "The Ladies' Man", season: 4, episode: 3,
        year: 1998, duration: "47 min",
        description: "A charming con artist is targeting wealthy women across Chicago.",
        archiveId: "due-south-1994-98", archiveIndex: 56,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e04", title: "Mojo Rising", season: 4, episode: 4,
        year: 1998, duration: "47 min",
        description: "A blues musician's lucky charm is stolen — along with the evidence in a murder case.",
        archiveId: "due-south-1994-98", archiveIndex: 57,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e05", title: "Dead Men Don't Throw Rice", season: 4, episode: 5,
        year: 1998, duration: "47 min",
        description: "A wedding party becomes the scene of a crime when the groom is found dead.",
        archiveId: "due-south-1994-98", archiveIndex: 58,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e06", title: "Odds", season: 4, episode: 6,
        year: 1998, duration: "47 min",
        description: "Illegal gambling connects a series of seemingly unrelated crimes.",
        archiveId: "due-south-1994-98", archiveIndex: 59,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e07", title: "Mountie Sings the Blues", season: 4, episode: 7,
        year: 1998, duration: "47 min",
        description: "Fraser goes undercover in the Chicago blues scene to catch a killer.",
        archiveId: "due-south-1994-98", archiveIndex: 60,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e08", title: "Good for the Soul", season: 4, episode: 8,
        year: 1998, duration: "47 min",
        description: "A priest's confession puts Fraser in an impossible ethical position.",
        archiveId: "due-south-1994-98", archiveIndex: 61,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e09", title: "A Likely Story", season: 4, episode: 9,
        year: 1998, duration: "47 min",
        description: "An improbable chain of coincidences leads Fraser to the truth in a baffling case.",
        archiveId: "due-south-1994-98", archiveIndex: 62,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e10", title: "Say Amen", season: 4, episode: 10,
        year: 1998, duration: "47 min",
        description: "A revival preacher is suspected of fraud — or something far worse.",
        archiveId: "due-south-1994-98", archiveIndex: 63,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e11", title: "Hunting Season", season: 4, episode: 11,
        year: 1998, duration: "47 min",
        description: "A dangerous game of cat and mouse unfolds across the city.",
        archiveId: "due-south-1994-98", archiveIndex: 64,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e12", title: "Call of the Wild (Part 1)", season: 4, episode: 12,
        year: 1998, duration: "47 min",
        description: "Fraser is drawn back to Canada as a series finale adventure begins.",
        archiveId: "due-south-1994-98", archiveIndex: 65,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
      {
        id: "ds-s04e13", title: "Call of the Wild (Part 2)", season: 4, episode: 13,
        year: 1998, duration: "47 min",
        description: "Fraser's final adventure concludes, bringing his journey full circle.",
        archiveId: "due-south-1994-98", archiveIndex: 66,
        thumbnail: "https://archive.org/services/img/due-south-1994-98",
      },
    ],
  },

  {
    id: "mash",
    title: "M*A*S*H",
    years: "1972–1983",
    genre: ["Drama", "Comedy", "War"],
    rating: "TV-PG",
    score: 9.1,
    description:
      "The staff of a mobile army surgical hospital during the Korean War deal with the horrors of battle through humor and camaraderie.",
    thumbnail: "https://archive.org/services/img/MashTVShow",
    featured: true,
    episodes: [
      {
        id: "mash-s01e01",
        title: "Pilot",
        season: 1,
        episode: 1,
        year: 1972,
        duration: "25 min",
        description: "Hawkeye and Trapper devise a scheme to raise money for a Korean orphan.",
        archiveId: "MASH_s01e01",
        thumbnail: "https://archive.org/services/img/MashTVShow",
      },
      {
        id: "mash-s01e02",
        title: "To Market, To Market",
        season: 1,
        episode: 2,
        year: 1972,
        duration: "25 min",
        description: "Henry trades the camp's hydrocort for a black market still.",
        archiveId: "MASH_s01e02",
        thumbnail: "https://archive.org/services/img/MashTVShow",
      },
    ],
  },
  {
    id: "all-in-the-family",
    title: "All in the Family",
    years: "1971–1979",
    genre: ["Comedy", "Drama"],
    rating: "TV-PG",
    score: 8.9,
    description:
      "Archie Bunker, a working-class bigot living in Queens, New York, clashes with his liberal son-in-law.",
    thumbnail: "https://archive.org/services/img/AllInTheFamily",
    featured: false,
    episodes: [
      {
        id: "aitf-s01e01",
        title: "Meet the Bunkers",
        season: 1,
        episode: 1,
        year: 1971,
        duration: "25 min",
        description: "Archie and Edith return home to find that Mike and Gloria have celebrated their anniversary without them.",
        archiveId: "AllInTheFamily_s01e01",
        thumbnail: "https://archive.org/services/img/AllInTheFamily",
      },
    ],
  },
  {
    id: "cheers",
    title: "Cheers",
    years: "1982–1993",
    genre: ["Comedy"],
    rating: "TV-PG",
    score: 9.0,
    description:
      "The regulars of Cheers, a Boston bar, deal with their relationships and quirky personalities.",
    thumbnail: "https://archive.org/services/img/CheersTV",
    featured: true,
    episodes: [
      {
        id: "cheers-s01e01",
        title: "Give Me a Ring Sometime",
        season: 1,
        episode: 1,
        year: 1982,
        duration: "25 min",
        description: "Diane Chambers ends up working at Cheers after being left by her fiancé.",
        archiveId: "Cheers_s01e01",
        thumbnail: "https://archive.org/services/img/CheersTV",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     V: THE SERIES  (1984–1985)
     NBC weekly follow-up to the two V miniseries. 19 episodes.
     Premiered October 26, 1984; finale March 22, 1985.
     Archive identifier for S01E19:
       v-the-series-1984-85-s-01e-19-the-return_202206
     ──────────────────────────────────────────────────────────── */
  {
    id: "v-the-series-1984",
    title: "V: The Series",
    years: "1984–1985",
    genre: ["Sci-Fi", "Drama", "Action"],
    rating: "TV-PG",
    score: 6.8,
    description:
      "NBC's weekly follow-up to the hit V miniseries. The alien Visitors have returned to occupy Earth, and the human resistance — led by Mike Donovan and Dr. Juliet Parrish — fights to drive them out. Stars Marc Singer, Faye Grant, Jane Badler, Michael Ironside, and Robert Englund.",
    thumbnail: "https://archive.org/services/img/v-the-series-1984-85-s-01e-19-the-return_202206",
    featured: false,
    episodes: [
      {
        id: "v-series-s01e19",
        title: "The Return",
        season: 1,
        episode: 19,
        year: 1985,
        duration: "46 min",
        description:
          "Series finale. The Visitors' Supreme Leader arrives on Earth, halts Diana's planned attack on Los Angeles, and orders the fleet to withdraw — proposing a truce that may finally end the alien occupation. Diana is taken away to answer for her crimes against humanity. Stars Marc Singer, Faye Grant, Jane Badler, Michael Ironside, and Robert Englund. Aired March 22, 1985 on NBC.",
        archiveId: "v-the-series-1984-85-s-01e-19-the-return_202206",
        thumbnail: "https://archive.org/services/img/v-the-series-1984-85-s-01e-19-the-return_202206",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE TWILIGHT ZONE  (1985–1987)
     CBS revival — archive identifier for S1E1:
       twilight-zone-1985-1x-01-shatterday
     Hosted/narrated by Charles Aidman. Premiered September 27, 1985
     with the two-part pilot "Shatterday / A Little Peace and Quiet."
     ──────────────────────────────────────────────────────────── */
  {
    id: "the-twilight-zone-1985",
    title: "The Twilight Zone (1985)",
    years: "1985–1987",
    genre: ["Drama", "Sci-Fi", "Fantasy", "Anthology"],
    rating: "TV-PG",
    score: 7.8,
    description:
      "CBS revival of Rod Serling's classic anthology series, presenting new tales of the unusual and the unexpected. Narrated by Charles Aidman, the revival ran for three seasons and featured an array of acclaimed directors and guest stars.",
    thumbnail: "https://archive.org/services/img/twilight-zone-1985-1x-01-shatterday",
    featured: false,
    episodes: [
      {
        id: "tz1985-s01e01",
        title: "Shatterday",
        season: 1,
        episode: 1,
        year: 1985,
        duration: "25 min",
        description:
          "Peter Jay Novins accidentally dials his own home phone number and is horrified to hear himself answer — a doppelganger who has taken over his life and is determined to improve it. As his double makes amends and grows stronger, Peter fades. Directed by Wes Craven; written by Alan Brennert from a story by Harlan Ellison; starring Bruce Willis.",
        archiveId: "twilight-zone-1985-1x-01-shatterday",
        thumbnail: "https://archive.org/services/img/twilight-zone-1985-1x-01-shatterday",
      },
    ],
  },
  {
    id: "the-twilight-zone",
    title: "The Twilight Zone",
    years: "1959–1964",
    genre: ["Drama", "Sci-Fi", "Fantasy"],
    rating: "TV-PG",
    score: 9.0,
    description:
      "Anthology series of tales of the unusual, the unexpected, and the macabre.",
    thumbnail: "https://archive.org/services/img/twilightzone",
    featured: true,
    episodes: [
      {
        id: "tz-s01e01",
        title: "Where Is Everybody?",
        season: 1,
        episode: 1,
        year: 1959,
        duration: "25 min",
        description: "A man finds himself in a small town completely devoid of any other people.",
        archiveId: "the.twilight.zone.s01e01",
        thumbnail: "https://archive.org/services/img/twilightzone",
      },
      {
        id: "tz-s01e16",
        title: "The Hitch-Hiker",
        season: 1,
        episode: 16,
        year: 1960,
        duration: "25 min",
        description: "A young woman is terrorized by a mysterious hitchhiker who appears no matter how far she drives.",
        archiveId: "TheTwilightZone-TheHitch-hiker",
        thumbnail: "https://archive.org/services/img/twilightzone",
      },
    ],
  },
  {
    id: "star-trek",
    title: "Star Trek: The Original Series",
    years: "1966–1969",
    genre: ["Sci-Fi", "Adventure"],
    rating: "TV-G",
    score: 8.4,
    description:
      "Captain Kirk and the crew of the Enterprise explore the galaxy in the 23rd century.",
    thumbnail: "https://archive.org/services/img/StarTrekOriginalSeries",
    featured: false,
    episodes: [
      {
        id: "tos-s01e01",
        title: "The Man Trap",
        season: 1,
        episode: 1,
        year: 1966,
        duration: "51 min",
        description: "A salt-craving creature capable of disguising itself preys on the Enterprise crew.",
        archiveId: "StarTrek_s01e01",
        thumbnail: "https://archive.org/services/img/StarTrekOriginalSeries",
      },
    ],
  },
  {
    id: "i-love-lucy",
    title: "I Love Lucy",
    years: "1951–1957",
    genre: ["Comedy"],
    rating: "TV-G",
    score: 8.9,
    description:
      "The misadventures of Lucy Ricardo and her husband Ricky, along with their best friends and landlords.",
    thumbnail: "https://archive.org/services/img/ILoveLucy",
    featured: false,
    episodes: [
      {
        id: "lucy-s01e01",
        title: "The Girls Want to Go to a Nightclub",
        season: 1,
        episode: 1,
        year: 1951,
        duration: "30 min",
        description: "Lucy and Ethel want to go to a nightclub for their anniversary but their husbands have other plans.",
        archiveId: "ILoveLucy_s01e01",
        thumbnail: "https://archive.org/services/img/ILoveLucy",
      },
    ],
  },
  {
    id: "the-andy-griffith-show",
    title: "The Andy Griffith Show",
    years: "1960–1968",
    genre: ["Comedy", "Drama"],
    rating: "TV-G",
    score: 8.7,
    description:
      "Sheriff Andy Taylor raises his son Opie in the fictional small town of Mayberry, North Carolina.",
    thumbnail: "https://archive.org/services/img/AndyGriffithShow",
    featured: false,
    episodes: [
      {
        id: "andy-s01e01",
        title: "The New Housekeeper",
        season: 1,
        episode: 1,
        year: 1960,
        duration: "25 min",
        description: "Andy's Aunt Bee arrives to take care of the Taylor household.",
        archiveId: "AndyGriffith_s01e01",
        thumbnail: "https://archive.org/services/img/AndyGriffithShow",
      },
    ],
  },
  {
    id: "leave-it-to-beaver",
    title: "Leave It to Beaver",
    years: "1957–1963",
    genre: ["Comedy", "Family"],
    rating: "TV-G",
    score: 8.1,
    description:
      "The adventures of the Cleaver family, particularly young Theodore 'Beaver' Cleaver.",
    thumbnail: "https://archive.org/services/img/LeaveItToBeaver",
    featured: false,
    episodes: [
      {
        id: "beaver-s01e01",
        title: "Beaver Gets 'Spelied'",
        season: 1,
        episode: 1,
        year: 1957,
        duration: "26 min",
        description: "Beaver tries to get out of a spelling test.",
        archiveId: "LeaveItToBeaver_s01e01",
        thumbnail: "https://archive.org/services/img/LeaveItToBeaver",
      },
    ],
  },
  {
    id: "seinfeld",
    title: "Seinfeld",
    years: "1989–1998",
    genre: ["Comedy"],
    rating: "TV-PG",
    score: 9.0,
    description:
      "The show about nothing follows Jerry Seinfeld and his group of quirky New York friends.",
    thumbnail: "https://archive.org/services/img/Seinfeld",
    featured: true,
    episodes: [
      {
        id: "sein-s01e01",
        title: "The Seinfeld Chronicles",
        season: 1,
        episode: 1,
        year: 1989,
        duration: "23 min",
        description: "Jerry awaits the arrival of a woman he met in Lansing to determine if she is his girlfriend.",
        archiveId: "Seinfeld_s01e01",
        thumbnail: "https://archive.org/services/img/Seinfeld",
      },
    ],
  },
  {
    id: "gilligans-island",
    title: "Gilligan's Island",
    years: "1964–1967",
    genre: ["Comedy", "Adventure"],
    rating: "TV-G",
    score: 7.3,
    description:
      "A group of castaways are stranded on a deserted island and try to find their way home.",
    thumbnail: "https://archive.org/services/img/GilligansIsland",
    featured: false,
    episodes: [
      {
        id: "gilligan-s01e01",
        title: "Two on a Raft",
        season: 1,
        episode: 1,
        year: 1964,
        duration: "25 min",
        description: "Gilligan and the Skipper set out on a raft to find help.",
        archiveId: "GilligansIsland_s01e01",
        thumbnail: "https://archive.org/services/img/GilligansIsland",
      },
    ],
  },
  {
    id: "the-brady-bunch",
    title: "The Brady Bunch",
    years: "1969–1974",
    genre: ["Comedy", "Family"],
    rating: "TV-G",
    score: 7.4,
    description:
      "A blended family navigates life together with six children and a helpful housekeeper.",
    thumbnail: "https://archive.org/services/img/TheBradyBunch",
    featured: false,
    episodes: [
      {
        id: "brady-s01e01",
        title: "The Honeymoon",
        season: 1,
        episode: 1,
        year: 1969,
        duration: "25 min",
        description: "Mike and Carol Brady prepare for their honeymoon while the kids adjust to their new family.",
        archiveId: "BradyBunch_s01e01",
        thumbnail: "https://archive.org/services/img/TheBradyBunch",
      },
    ],
  },
  {
    id: "columbo",
    title: "Columbo",
    years: "1971–2003",
    genre: ["Crime", "Drama", "Mystery"],
    rating: "TV-PG",
    score: 8.6,
    description:
      "A seemingly disheveled but brilliant L.A. police detective uses his humble demeanor to lull murderers into letting down their guard.",
    thumbnail: "https://archive.org/services/img/Columbo",
    featured: true,
    episodes: [
      {
        id: "columbo-s01e01",
        title: "Murder by the Book",
        season: 1,
        episode: 1,
        year: 1971,
        duration: "73 min",
        description: "Columbo investigates when a mystery writer murders his partner.",
        archiveId: "Columbo_MurderByTheBook",
        thumbnail: "https://archive.org/services/img/Columbo",
      },
    ],
  },
  {
    id: "the-mary-tyler-moore-show",
    title: "The Mary Tyler Moore Show",
    years: "1970–1977",
    genre: ["Comedy", "Drama"],
    rating: "TV-G",
    score: 8.1,
    description:
      "Mary Richards moves to Minneapolis and starts working at a TV news station, navigating single life and career.",
    thumbnail: "https://archive.org/services/img/MaryTylerMoore",
    featured: false,
    episodes: [
      {
        id: "mtm-s01e01",
        title: "Love Is All Around",
        season: 1,
        episode: 1,
        year: 1970,
        duration: "25 min",
        description: "Mary Richards arrives in Minneapolis and lands a job at WJM-TV.",
        archiveId: "MaryTylerMoore_s01e01",
        thumbnail: "https://archive.org/services/img/MaryTylerMoore",
      },
    ],
  },
  {
    id: "happy-days",
    title: "Happy Days",
    years: "1974–1984",
    genre: ["Comedy", "Drama"],
    rating: "TV-G",
    score: 7.4,
    description:
      "Set in 1950s Milwaukee, the Cunningham family and their friend Fonzie experience life in the golden age of rock and roll.",
    thumbnail: "https://archive.org/services/img/HappyDays",
    featured: false,
    episodes: [
      {
        id: "happydays-s01e01",
        title: "All the Way",
        season: 1,
        episode: 1,
        year: 1974,
        duration: "25 min",
        description: "Richie Cunningham tries to prove himself at the drive-in.",
        archiveId: "HappyDays_s01e01",
        thumbnail: "https://archive.org/services/img/HappyDays",
      },
    ],
  },
  {
    id: "the-price-is-right",
    title: "The Price Is Right",
    years: "1972–present",
    genre: ["Game Show"],
    rating: "TV-G",
    score: 7.6,
    description:
      "Contestants compete by trying to correctly price merchandise to win cash and prizes.",
    thumbnail: "https://archive.org/services/img/ThePriceIsRight",
    featured: false,
    episodes: [
      {
        id: "tpir-s01e01",
        title: "Premiere Episode",
        season: 1,
        episode: 1,
        year: 1972,
        duration: "60 min",
        description: "The first episode of the long-running game show hosted by Bob Barker.",
        archiveId: "ThePriceIsRight_premiere",
        thumbnail: "https://archive.org/services/img/ThePriceIsRight",
      },
      {
        id: "tpir-s13e5731d",
        title: "Episode #5731D (May 13, 1985)",
        season: 13,
        episode: 131,
        year: 1985,
        duration: "60 min",
        description: "Bob Barker hosts a classic episode featuring six pricing games: Lucky Seven, Safe Crackers, The Phone Home Game, Squeeze Play, Secret X, and 3 Strikes.",
        archiveId: "tpir-5731d",
        thumbnail: "https://archive.org/services/img/tpir-5731d",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     WASHINGTOON  (1985)
     TV sitcom — archive identifier: washingtoon-1985
     Short-lived Showtime political satire; 10 episodes produced,
     2 currently preserved on the Internet Archive (episodes 5 & 8).
     Notable as an early credit for Christina Applegate.
     ──────────────────────────────────────────────────────────── */
  {
    id: "washingtoon-1985",
    title: "Washingtoon",
    years: "1985",
    genre: ["Comedy"],
    rating: "TV-PG",
    score: 6.1,
    description:
      "Idealistic Congressman Bob Forehead uproots his family to Washington D.C. and tries to govern with honesty — a near-impossible task surrounded by the scheming veteran Senator Bunky Munster and the absurdities of Capitol Hill. A sharp political satire that aired on Showtime in 1985, notable as one of Christina Applegate's earliest television roles.",
    thumbnail: "https://archive.org/services/img/washingtoon-1985",
    featured: false,
    episodes: [
      {
        id: "washingtoon-s01e05",
        title: "Episode 5",
        season: 1,
        episode: 5,
        year: 1985,
        duration: "30 min",
        description: "Congressman Forehead organises a baseball game between Latin American leaders and the U.S. Congress, with predictably chaotic results.",
        archiveId: "washingtoon-1985",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/washingtoon-1985",
      },
      {
        id: "washingtoon-s01e08",
        title: "Episode 8",
        season: 1,
        episode: 8,
        year: 1985,
        duration: "30 min",
        description: "A hostage situation unfolds on Capitol Hill, forcing Congressman Forehead to improvise his way through a crisis that exposes Washington's finest at their worst.",
        archiveId: "washingtoon-1985",
        archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/washingtoon-1985",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE CARE BEARS BATTLE THE FREEZE MACHINE  (1984)
     Single TV special — archive identifier:
       the-care-bears-battle-the-freeze-machine-1984-etc.
     Original VHS release (Family Home Entertainment) containing the
     ~30-min special plus read-along bonus content.
     Introduces Grams Bear, Hugs, Tugs, and villain Frostbite.
     ──────────────────────────────────────────────────────────── */
  {
    id: "care-bears-freeze-machine-1984",
    type: "movie",
    title: "The Care Bears Battle the Freeze Machine",
    years: "1984",
    genre: ["Animation", "Family", "Fantasy"],
    rating: "G",
    score: 6.4,
    description:
      "The villainous Professor Coldheart unleashes his Careless Ray Contraption to freeze the world and drain it of all feeling. When he kidnaps the baby Care Bears Hugs and Tugs, Tenderheart Bear and the gang must race to the rescue — and help a young boy named Paul learn the power of forgiveness. The special introduces beloved new characters Grams Bear and sidekick Frostbite.",
    thumbnail: "https://archive.org/services/img/the-care-bears-battle-the-freeze-machine-1984-etc.",
    featured: false,
    episodes: [
      {
        id: "care-bears-freeze-machine-1984-full",
        title: "The Care Bears Battle the Freeze Machine",
        season: 0,
        episode: 0,
        year: 1984,
        duration: "30 min",
        description:
          "Professor Coldheart kidnaps Hugs and Tugs and plans to freeze the world. The Care Bears must save the baby bears and teach a bullied boy about caring.",
        archiveId: "the-care-bears-battle-the-freeze-machine-1984-etc.",
        thumbnail: "https://archive.org/services/img/the-care-bears-battle-the-freeze-machine-1984-etc.",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     CAT'S EYE  (1985)
     Single feature film — archive identifier: cats-eye-1985-dvdrip
     Stephen King anthology directed by Lewis Teague.
     ──────────────────────────────────────────────────────────── */
  {
    id: "cats-eye-1985",
    type: "movie",
    title: "Cat's Eye",
    years: "1985",
    genre: ["Horror", "Thriller", "Fantasy"],
    rating: "PG-13",
    score: 6.4,
    description:
      "A stray tomcat threads through three Stephen King tales of dark suspense. In Quitters, Inc., a man's smoking cessation program has terrifyingly high stakes. In The Ledge, an adulterer is forced to walk the rain-slicked ledge of a high-rise skyscraper. In General, the cat finally reaches the girl it has been searching for — just in time to battle the tiny troll that haunts her bedroom walls. Stars James Woods, Robert Hays, and Drew Barrymore.",
    thumbnail: "https://archive.org/services/img/cats-eye-1985-dvdrip",
    featured: false,
    episodes: [
      {
        id: "cats-eye-1985-full",
        title: "Cat's Eye",
        season: 0,
        episode: 0,
        year: 1985,
        duration: "94 min",
        description:
          "Three Stephen King stories of suspense and dark irony — Quitters Inc., The Ledge, and General — linked by the wandering journey of a stray cat.",
        archiveId: "cats-eye-1985-dvdrip",
        thumbnail: "https://archive.org/services/img/cats-eye-1985-dvdrip",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     CREATURE  (1985)
     Single feature film — archive identifier:
       creature-1985-horror-sci-fi-full-color-movie
     Dir. William Malone. Cult sci-fi horror featuring Klaus Kinski.
     ──────────────────────────────────────────────────────────── */
  {
    id: "creature-1985",
    type: "movie",
    title: "Creature",
    years: "1985",
    genre: ["Horror", "Sci-Fi"],
    rating: "R",
    score: 5.5,
    description:
      "On Titan, Saturn's largest moon, an American scientific crew investigating ancient alien artefacts accidentally unleashes a savage extraterrestrial organism. As the creature hunts them down and uses parasites to reanimate its victims, the survivors join forces with the remnants of a rival German expedition — including the enigmatic Hans Rudy Hofner — in a desperate bid to survive. A cult Alien-influenced thriller featuring Klaus Kinski.",
    thumbnail: "https://archive.org/services/img/creature-1985-horror-sci-fi-full-color-movie",
    featured: false,
    episodes: [
      {
        id: "creature-1985-full",
        title: "Creature",
        season: 0,
        episode: 0,
        year: 1985,
        duration: "97 min",
        description:
          "A scientific crew on Titan releases a deadly alien organism that begins hunting them one by one, using parasites to control its victims.",
        archiveId: "creature-1985-horror-sci-fi-full-color-movie",
        thumbnail: "https://archive.org/services/img/creature-1985-horror-sci-fi-full-color-movie",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE CARE BEARS MOVIE  (1985)
     Single feature film — archive identifier:
       the-care-bears-movie-vestron-video-original-1985-release_202109
     Vestron Video original 1985 VHS release, digitised for preservation.
     ──────────────────────────────────────────────────────────── */
  {
    id: "care-bears-movie-1985",
    type: "movie",
    title: "The Care Bears Movie",
    years: "1985",
    genre: ["Animation", "Family", "Fantasy"],
    rating: "G",
    score: 6.8,
    description:
      "Two lonely orphans discover the magic of Care-a-Lot, the cloud-high home of the Care Bears. But an evil spirit has tricked a young magician's apprentice named Nicholas into spreading sadness and mistrust across the world. The Care Bears must join forces with their cousins to stop Nicholas and show him that somebody really does care. Featuring the voice of Mickey Rooney and a young Cree Summer.",
    thumbnail: "https://archive.org/services/img/the-care-bears-movie-vestron-video-original-1985-release_202109",
    featured: false,
    episodes: [
      {
        id: "care-bears-movie-1985-full",
        title: "The Care Bears Movie",
        season: 0,
        episode: 0,
        year: 1985,
        duration: "75 min",
        description:
          "The Care Bears travel to Earth to help two orphaned children and stop an evil spirit from draining the world of love and friendship.",
        archiveId: "the-care-bears-movie-vestron-video-original-1985-release_202109",
        thumbnail: "https://archive.org/services/img/the-care-bears-movie-vestron-video-original-1985-release_202109",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     SUPERMAN II — ABC SUNDAY NIGHT MOVIE BROADCAST  (1985)
     Single feature film — archive identifier: 1985abcsuperman2full
     Recorded live from the ABC Sunday Night Movie, December 29 1985,
     on a Sony T-120 VHS tape; includes original commercials.
     This extended ABC cut runs ~143 min vs. the 127-min theatrical release
     and contains exclusive scenes not in either the theatrical or
     the later Richard Donner Cut.
     ──────────────────────────────────────────────────────────── */
  {
    id: "superman-ii-abc-1985",
    type: "movie",
    title: "Superman II (ABC 1985 Broadcast)",
    years: "1985",
    genre: ["Action", "Adventure", "Sci-Fi"],
    rating: "PG",
    score: 7.8,
    description:
      "Three super-powered Kryptonian criminals — General Zod, Ursa, and Non — are freed from the Phantom Zone and ally with Lex Luthor to conquer Earth. Superman must choose between his love for Lois Lane and his duty to humanity. This rare extended ABC television cut includes scenes absent from the theatrical release. Stars Christopher Reeve, Margot Kidder, Gene Hackman, and Terence Stamp.",
    thumbnail: "https://archive.org/services/img/1985abcsuperman2full",
    featured: true,
    episodes: [
      {
        id: "superman-ii-abc-1985-full",
        title: "Superman II (ABC Broadcast)",
        season: 0,
        episode: 0,
        year: 1985,
        duration: "143 min",
        description:
          "The extended 1985 ABC broadcast of Superman II, featuring General Zod's invasion of Earth and Superman's struggle between love and duty — with exclusive scenes not in the theatrical cut.",
        archiveId: "1985abcsuperman2full",
        thumbnail: "https://archive.org/services/img/1985abcsuperman2full",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE NEW ALFRED HITCHCOCK PRESENTS  (1985–1989)
     Anthology TV series — archive identifier:
       the-new-alfred-hitchcock-presents-complete
     NBC / USA Network revival of the classic Hitchcock anthology.
     Pilot (May 1985): 4 segments → approximate archiveIndex 0–3.
     Season 1 (1985–86, 22 eps):  approx. index  4–25
     Season 2 (1987,    13 eps):  approx. index 26–38
     Season 3 (1988,    21 eps):  approx. index 39–59
     Season 4 (1988–89, 20 eps):  approx. index 60–79
     Indices are sequential estimates based on file-listing order;
     exact values depend on how archive.org sorts the item's files.
     ──────────────────────────────────────────────────────────── */
  {
    id: "new-alfred-hitchcock-presents",
    title: "The New Alfred Hitchcock Presents",
    years: "1985–1989",
    genre: ["Drama", "Thriller", "Mystery", "Crime"],
    rating: "TV-PG",
    score: 7.9,
    description:
      "The anthology revival of Hitchcock's legendary suspense series, updated for the 1980s. Each episode delivers a new tale of mystery, irony, and the macabre — introduced by the master director's vintage monologues. Stories of crime, obsession, and unexpected twists, originally broadcast on NBC and then USA Network.",
    thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
    featured: true,
    episodes: [
      /* ── Pilot (May 5, 1985) — 4 anthology segments ── */
      {
        id: "nahp-s00e01", title: "Incident in a Small Jail", season: 0, episode: 1,
        year: 1985, duration: "30 min",
        description: "A man locked up overnight in a small-town jail discovers the cell's previous occupants met gruesome ends.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s00e02", title: "Man from the South", season: 0, episode: 2,
        year: 1985, duration: "30 min",
        description: "A mysterious gambler wagers a young man's finger against the keys to a brand-new Cadillac on the outcome of a simple lighter bet.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s00e03", title: "Bang! You're Dead!", season: 0, episode: 3,
        year: 1985, duration: "30 min",
        description: "A young boy unwittingly loads a real revolver and carries it through town, sending the neighborhood into a hidden panic.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s00e04", title: "An Unlocked Window", season: 0, episode: 4,
        year: 1985, duration: "30 min",
        description: "Two nurses caring for a bedridden patient on a stormy night realise a killer who targets nurses is still at large — and very close.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 3,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      /* ── Season 1 (1985–86) ── */
      {
        id: "nahp-s01e01", title: "Revenge", season: 1, episode: 1,
        year: 1985, duration: "30 min",
        description: "A woman tells her husband she was attacked by a man — and when her husband spots the attacker in a crowd, he takes brutal revenge.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 4,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e02", title: "Night Fever", season: 1, episode: 2,
        year: 1985, duration: "30 min",
        description: "A taxi driver's late-night fare becomes a deadly ride when he suspects his passenger of murder.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 5,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e03", title: "Wake Me When I'm Dead", season: 1, episode: 3,
        year: 1985, duration: "30 min",
        description: "A man fakes his own death to escape his troubles, only to find that death has its own very literal consequences.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 6,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e04", title: "Final Escape", season: 1, episode: 4,
        year: 1985, duration: "30 min",
        description: "A prisoner hatches an elaborate scheme to escape inside a coffin — not knowing who has just been buried in it.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 7,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e05", title: "The Night Caller", season: 1, episode: 5,
        year: 1985, duration: "30 min",
        description: "A woman receives increasingly threatening telephone calls from a stranger who seems to know her every move.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 8,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e06", title: "Method Actor", season: 1, episode: 6,
        year: 1985, duration: "30 min",
        description: "An actor preparing for a role as a killer begins to blur the line between performance and reality.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 9,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e07", title: "The Human Interest Story", season: 1, episode: 7,
        year: 1985, duration: "30 min",
        description: "A journalist fabricates a heartwarming story that spins dangerously out of control.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 10,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e08", title: "Breakdown", season: 1, episode: 8,
        year: 1985, duration: "30 min",
        description: "A hard-hearted businessman survives a car crash but is completely paralysed — and must convince rescuers he is still alive.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 11,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e09", title: "Prisoners", season: 1, episode: 9,
        year: 1985, duration: "30 min",
        description: "Two escaped convicts take refuge in a remote farmhouse, setting off a deadly standoff with its occupants.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 12,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e10", title: "Gigolo", season: 1, episode: 10,
        year: 1985, duration: "30 min",
        description: "A charming professional escort finds his carefully maintained double life beginning to unravel.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 13,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e11", title: "The Gloating Place", season: 1, episode: 11,
        year: 1985, duration: "30 min",
        description: "A murderer returns to savour his perfect crime — but his victim may not be finished with him yet.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 14,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e12", title: "The Right Kind of Medicine", season: 1, episode: 12,
        year: 1985, duration: "30 min",
        description: "A pharmacist discovers his new assistant knows far too much about a prescription he filled for a recent murder victim.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 15,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e13", title: "Beast in View", season: 1, episode: 13,
        year: 1985, duration: "30 min",
        description: "A woman receives terrifying phone calls from someone who claims to know her darkest secret — but the caller may be closer than she thinks.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 16,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e14", title: "A Very Happy Ending", season: 1, episode: 14,
        year: 1985, duration: "30 min",
        description: "A seemingly perfect marriage conceals a very unhappy truth — and someone is about to reveal it.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 17,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e15", title: "The Canary Sedan", season: 1, episode: 15,
        year: 1985, duration: "30 min",
        description: "A woman plagued by visions of a ghostly yellow car discovers the haunting may have deadly real-world origins.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 18,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e16", title: "Enough Rope for Two", season: 1, episode: 16,
        year: 1985, duration: "30 min",
        description: "Two small-time criminals plot a kidnapping, unaware their victim has deadly plans of his own.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 19,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e17", title: "The Creeper", season: 1, episode: 17,
        year: 1985, duration: "30 min",
        description: "A neighbourhood is terrorised by a strangler, and one woman's certainty about who the killer is may put her in terrible danger.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 20,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e18", title: "Happy Birthday", season: 1, episode: 18,
        year: 1985, duration: "30 min",
        description: "A woman's birthday celebration turns sinister when she suspects her husband is planning to make it her last.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 21,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e19", title: "The Jar", season: 1, episode: 19,
        year: 1985, duration: "30 min",
        description: "A man purchases a mysterious jar at a carnival sideshow and discovers its disturbing contents divide his community — and his sanity.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 22,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e20", title: "Deadly Honeymoon", season: 1, episode: 20,
        year: 1985, duration: "30 min",
        description: "A newlywed couple's honeymoon turns to nightmare when the bride is attacked and her husband sets out for vengeance.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 23,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e21", title: "Four O'Clock", season: 1, episode: 21,
        year: 1985, duration: "30 min",
        description: "A paranoid husband plants a bomb set to go off at four o'clock to kill his wife — then finds himself unable to stop it.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 24,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e22", title: "Road Hog", season: 1, episode: 22,
        year: 1985, duration: "30 min",
        description: "An aggressive driver's road-rage confrontation with a motorcycle gang escalates far beyond anyone's expectations.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 25,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      /* ── Season 2 (1987) ── */
      {
        id: "nahp-s02e01", title: "The Initiation", season: 2, episode: 1,
        year: 1987, duration: "30 min",
        description: "A college pledge's hazing ritual takes a fatal turn that the fraternity desperately tries to cover up.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 26,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e02", title: "Conversation Over a Corpse", season: 2, episode: 2,
        year: 1987, duration: "30 min",
        description: "Two neighbours chat about their petty grievances while one of them is concealing a very inconvenient body.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 27,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e03", title: "Man on the Edge", season: 2, episode: 3,
        year: 1987, duration: "30 min",
        description: "A man teetering on a building ledge holds a city transfixed — and holds secrets that the police need to uncover fast.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 28,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e04", title: "If the Shoe Fits", season: 2, episode: 4,
        year: 1987, duration: "30 min",
        description: "A Cinderella story with a dark twist, where the wrong person ends up wearing the glass slipper.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 29,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e05", title: "The Mole", season: 2, episode: 5,
        year: 1987, duration: "30 min",
        description: "An intelligence agency hunts for a leak in its ranks, with suspicion falling on the last person anyone would suspect.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 30,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e06", title: "Anniversary Gift", season: 2, episode: 6,
        year: 1987, duration: "30 min",
        description: "A husband's anniversary surprise for his wife turns into something neither of them could have anticipated.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 31,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e07", title: "The Impatient Patient", season: 2, episode: 7,
        year: 1987, duration: "30 min",
        description: "A hospital patient's desperate demand to be discharged puts both his life and his doctor's career in jeopardy.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 32,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e08", title: "When This Man Dies", season: 2, episode: 8,
        year: 1987, duration: "30 min",
        description: "A small-town man receives a series of cryptic notes warning that someone will die each time he ignores them.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 33,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e09", title: "The Specialty of the House", season: 2, episode: 9,
        year: 1987, duration: "30 min",
        description: "The members of an exclusive restaurant club discover too late that the specialty of the house is more special than they imagined.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 34,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e10", title: "The Final Twist", season: 2, episode: 10,
        year: 1987, duration: "30 min",
        description: "A crime writer's research into a real unsolved murder leads him closer to the truth — and the killer — than he ever intended.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 35,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e11", title: "Tragedy Tonight!", season: 2, episode: 11,
        year: 1987, duration: "30 min",
        description: "A live TV broadcast becomes an unexpected confessional when a guest on air reveals a shocking crime.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 36,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e12", title: "World's Oldest Motive", season: 2, episode: 12,
        year: 1987, duration: "30 min",
        description: "A couple's marriage is threatened by jealousy and suspicion, with deadly consequences for everyone involved.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 37,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e13", title: "Deathmate", season: 2, episode: 13,
        year: 1987, duration: "30 min",
        description: "A lonely-hearts club match leads to a relationship with a very dark past — and a very dangerous future.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 38,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      /* ── Season 3 (1988) ── */
      {
        id: "nahp-s03e01", title: "VCR", season: 3, episode: 1,
        year: 1988, duration: "30 min",
        description: "A scheming business partner uses a videotaped confession to blackmail a colleague into an ever-tightening corner.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 39,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e02", title: "Animal Lovers", season: 3, episode: 2,
        year: 1988, duration: "30 min",
        description: "A couple's obsessive devotion to their pets masks something far more sinister lurking beneath the surface of their relationship.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 40,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e03", title: "Prism", season: 3, episode: 3,
        year: 1988, duration: "30 min",
        description: "The same crime is replayed from four radically different points of view, each version revealing a new unsettling truth.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 41,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e04", title: "A Stolen Heart", season: 3, episode: 4,
        year: 1988, duration: "30 min",
        description: "A woman falls for a charming stranger, unaware that her heart is not the only thing he intends to take from her.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 42,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e05", title: "Houdini on Channel Four", season: 3, episode: 5,
        year: 1988, duration: "30 min",
        description: "A TV escape artist's most dangerous stunt is not the one broadcast live — it's what he is trying to escape in real life.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 43,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e06", title: "Killer Takes All", season: 3, episode: 6,
        year: 1988, duration: "30 min",
        description: "A seemingly innocent board game tournament becomes the setting for a deadly contest with very real consequences.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 44,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e07", title: "Hippocritic Oath", season: 3, episode: 7,
        year: 1988, duration: "30 min",
        description: "A doctor torn between his oath to do no harm and his personal desire for revenge makes a choice he cannot undo.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 45,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e08", title: "Prosecutor", season: 3, episode: 8,
        year: 1988, duration: "30 min",
        description: "A crusading district attorney's pursuit of a killer leads him to evidence that could destroy his own carefully built career.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 46,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e09", title: "If Looks Could Kill", season: 3, episode: 9,
        year: 1988, duration: "30 min",
        description: "A woman convinced her husband is trying to murder her takes drastic pre-emptive action — only to discover she was right for the wrong reasons.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 47,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e10", title: "You'll Die Laughing", season: 3, episode: 10,
        year: 1988, duration: "30 min",
        description: "A stand-up comedian's darkest jokes turn out to contain more truth than even he realised.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 48,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e11", title: "Murder Party", season: 3, episode: 11,
        year: 1988, duration: "30 min",
        description: "A murder-mystery dinner party goes horribly wrong when the scripted corpse turns out to be a real one.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 49,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e12", title: "Twist", season: 3, episode: 12,
        year: 1988, duration: "30 min",
        description: "A cheating husband's elaborate alibi twists back on him with lethal precision.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 50,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e13", title: "User Deadly", season: 3, episode: 13,
        year: 1988, duration: "30 min",
        description: "A computer whiz uses the early internet to stalk a target — not realising his victim is tracking him right back.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 51,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e14", title: "Career Move", season: 3, episode: 14,
        year: 1988, duration: "30 min",
        description: "An ambitious executive eliminates his competition one step at a time, until the next rung on the ladder bites back.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 52,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e15", title: "Full Disclosure", season: 3, episode: 15,
        year: 1988, duration: "30 min",
        description: "A confessional memoir causes a sensation — and a chain of events that its author never anticipated.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 53,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e16", title: "Kandinsky's Vault", season: 3, episode: 16,
        year: 1988, duration: "30 min",
        description: "An art heist goes perfectly — until the thieves discover what is really hidden behind the painting.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 54,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e17", title: "There Was a Little Girl...", season: 3, episode: 17,
        year: 1988, duration: "30 min",
        description: "A child's disturbing account of events no child should have witnessed sets a detective on an unsettling trail.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 55,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e18", title: "Twisted Sisters", season: 3, episode: 18,
        year: 1988, duration: "30 min",
        description: "Twin sisters share everything — including a mutual taste for deadly scheming against each other.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 56,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e19", title: "The 13th Floor", season: 3, episode: 19,
        year: 1988, duration: "30 min",
        description: "An office worker discovers that the supposedly non-existent 13th floor of her building harbours a terrifying secret.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 57,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e20", title: "Hunted (Part 1)", season: 3, episode: 20,
        year: 1988, duration: "30 min",
        description: "A man on the run from ruthless pursuers must piece together why he is being hunted before time runs out. (Part 1 of 2)",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 58,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s03e21", title: "Hunted (Part 2)", season: 3, episode: 21,
        year: 1988, duration: "30 min",
        description: "The hunted man makes his final stand as the truth behind the conspiracy closes in around him. (Part 2 of 2)",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 59,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      /* ── Season 4 (1988–89) ── */
      {
        id: "nahp-s04e01", title: "Fogbound", season: 4, episode: 1,
        year: 1988, duration: "30 min",
        description: "A sea crossing shrouded in fog becomes a voyage of terror when a passenger realises a killer is aboard.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 60,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e02", title: "Pen Pal", season: 4, episode: 2,
        year: 1988, duration: "30 min",
        description: "A years-long correspondence between pen pals masks an obsession that is about to turn dangerous.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 61,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e03", title: "Ancient Voices", season: 4, episode: 3,
        year: 1988, duration: "30 min",
        description: "An archaeologist's discovery at a remote dig site awakens something that was better left buried.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 62,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e04", title: "Survival of the Fittest", season: 4, episode: 4,
        year: 1988, duration: "30 min",
        description: "A wilderness survival retreat strips away the civilised veneer of its corporate participants with fatal results.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 63,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e05", title: "The Big Spin", season: 4, episode: 5,
        year: 1989, duration: "30 min",
        description: "A lottery winner's overnight change in fortune attracts exactly the wrong kind of attention.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 64,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e06", title: "Don't Sell Yourself Short", season: 4, episode: 6,
        year: 1989, duration: "30 min",
        description: "A con artist's latest scheme to undersell a mark spirals into consequences far beyond his control.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 65,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e07", title: "For Art's Sake", season: 4, episode: 7,
        year: 1989, duration: "30 min",
        description: "A forger's masterpiece is so perfect it ensnares him in a deception that he cannot escape.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 66,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e08", title: "Murder in Mind", season: 4, episode: 8,
        year: 1989, duration: "30 min",
        description: "A hypnotherapy session unlocks a patient's hidden memories — including a murder she may have committed.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 67,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e09", title: "Mirror, Mirror", season: 4, episode: 9,
        year: 1989, duration: "30 min",
        description: "A vain socialite's obsession with her reflection begins to show her things that cannot possibly be there.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 68,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e10", title: "Skeleton in the Closet", season: 4, episode: 10,
        year: 1989, duration: "30 min",
        description: "A literal skeleton discovered during a home renovation drags a family's buried secrets back into the light.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 69,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e11", title: "In the Driver's Seat", season: 4, episode: 11,
        year: 1989, duration: "30 min",
        description: "A woman who picks up a hitchhiker finds herself rapidly losing control of both her car and her situation.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 70,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e12", title: "D.U.I.", season: 4, episode: 12,
        year: 1989, duration: "30 min",
        description: "A drunk-driving accident sets off a chain of cover-ups and lies that ultimately destroys everyone involved.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 71,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e13", title: "In the Name of Science", season: 4, episode: 13,
        year: 1989, duration: "30 min",
        description: "A scientist's secret experiment on unwitting human subjects crosses every ethical line — and provokes an explosive response.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 72,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e14", title: "Romance Machine", season: 4, episode: 14,
        year: 1989, duration: "30 min",
        description: "A computer dating service pairs its users with disturbing precision — including one match nobody should have made.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 73,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e15", title: "Diamonds Aren't Forever", season: 4, episode: 15,
        year: 1989, duration: "30 min",
        description: "A jewel thief's perfect heist comes undone when his partner falls for the mark — and the mark knows exactly what is going on.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 74,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e16", title: "My Dear Watson", season: 4, episode: 16,
        year: 1989, duration: "30 min",
        description: "A self-styled amateur detective's meddling in a real murder investigation puts him squarely in the killer's sights.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 75,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e17", title: "Night Creatures", season: 4, episode: 17,
        year: 1989, duration: "30 min",
        description: "Strange noises from a neighbouring flat lead a curious resident into a discovery she desperately wishes she could un-make.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 76,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e18", title: "The Man Who Knew Too Little", season: 4, episode: 18,
        year: 1989, duration: "30 min",
        description: "An unwitting bystander who witnesses a crime is kept alive only because the killers believe he saw nothing — but he saw everything.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 77,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e19", title: "Reunion", season: 4, episode: 19,
        year: 1989, duration: "30 min",
        description: "Old school friends gather for a reunion, and one of them has waited decades to settle a very old score.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 78,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s04e20", title: "South by Southeast", season: 4, episode: 20,
        year: 1989, duration: "30 min",
        description: "A case of mistaken identity hurls an ordinary man into a deadly chase across state lines in the tradition of Hitchcock's classic wrong-man thrillers.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveIndex: 79,
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     NORTHERN EXPOSURE  (1990–1995)
     CBS comedy-drama set in Cicely, Alaska. 6 seasons, 110 episodes.
     Premiered July 12, 1990. Won the Emmy for Outstanding Drama Series.
     Archive identifier: Random_Television_and_Northern_Exposure
     ──────────────────────────────────────────────────────────── */
  {
    id: "northern-exposure-1990",
    title: "Northern Exposure",
    years: "1990–1995",
    genre: ["Drama", "Comedy"],
    rating: "TV-PG",
    score: 8.1,
    description:
      "A neurotic New York City doctor, Joel Fleischman, is sent to the quirky fictional town of Cicely, Alaska to fulfill his medical school scholarship obligations. What follows is a warm, witty, and philosophical comedy-drama about culture clash, community, and self-discovery. Stars Rob Morrow, Janine Turner, Barry Corbin, John Cullum, John Corbett, and Darren E. Burrows.",
    thumbnail: "https://archive.org/services/img/Random_Television_and_Northern_Exposure",
    featured: false,
    episodes: [
      {
        id: "northern-exposure-s01e01",
        title: "Pilot",
        season: 1,
        episode: 1,
        year: 1990,
        duration: "47 min",
        description:
          "Dr. Joel Fleischman arrives in Cicely, Alaska expecting to be assigned to Anchorage, only to discover he must serve the remote, eccentric small town to repay his scholarship. He meets bush pilot Maggie O'Connell, ex-astronaut Maurice Minnifield, philosophical radio DJ Chris Stevens, and the rest of Cicely's colorful residents. Aired July 12, 1990 on CBS.",
        archiveId: "Random_Television_and_Northern_Exposure",
        thumbnail: "https://archive.org/services/img/Random_Television_and_Northern_Exposure",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE BUSH BABY  (1992)
     World Masterpiece Theater anime adaptation of William Stevenson's
     novel "The Bushbabies." 40 episodes, Nippon Animation / Fuji TV.
     English dub produced by Cinélume (Montreal); aired in Canada on
     TVOntario and Global TV in the mid-1990s.
     Archive identifier: the-bush-baby-english-dub_202409
     ──────────────────────────────────────────────────────────── */
  {
    id: "bush-baby-1992",
    title: "The Bush Baby",
    years: "1992",
    genre: ["Drama", "Family", "Adventure"],
    rating: "TV-G",
    score: 7.9,
    description:
      "Set in Kenya in 1964, this beloved World Masterpiece Theater anime follows 13-year-old Jackie Rhodes, the daughter of a British wildlife officer, who rescues and raises an injured bushbaby she names Murphy. When her family must return to England, Jackie sets out on a dangerous journey across the African savanna to return Murphy to the wild, guided by her loyal friend Tembo. Based on William Stevenson's novel, the English dub starred Pauline Little, Mark Camacho, and Daniel Brochu.",
    thumbnail: "https://archive.org/services/img/the-bush-baby-english-dub_202409",
    featured: false,
    episodes: [
      {
        id: "bush-baby-1992-eng",
        title: "The Bush Baby (English Dub)",
        season: 1,
        episode: 1,
        year: 1992,
        duration: "25 min",
        description:
          "Jackie Rhodes, the young daughter of a British wildlife officer in Kenya, rescues an injured bushbaby and names him Murphy. As her family prepares to leave Africa, Jackie vows to return Murphy to the wild — beginning an epic adventure across the savanna alongside her friend Tembo.",
        archiveId: "the-bush-baby-english-dub_202409",
        thumbnail: "https://archive.org/services/img/the-bush-baby-english-dub_202409",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     FOX KIDS VHS OFF-AIRS WOC  (1992–94)
     Collection of off-air VHS recordings of FOX Kids and ABC Saturday
     Morning programming captured from WOC (Davenport, IA) and other
     stations, 1992–1994. Includes original commercials (WOC = With
     Original Commercials).
     Archive identifier: fox-kids-1992-3-vhs-off-airs-woc
     ──────────────────────────────────────────────────────────── */
  {
    id: "fox-kids-1992-vhs-woc",
    type: "movie",
    title: "FOX Kids 1992–3 VHS Off-Airs (WOC)",
    years: "1992",
    genre: ["Animation", "Family", "Kids"],
    rating: "TV-Y7",
    score: 8.2,
    description:
      "A treasured collection of off-air VHS recordings capturing FOX Kids and ABC Saturday Morning programming from 1992–1994, complete with original commercials (WOC). Highlights include the premiere episode of Batman: The Animated Series (\"The Cat and the Claw\"), Darkwing Duck (\"That Sinking Feeling\"), Beetlejuice (\"Pest o' The West\"), Attack of the Killer Tomatoes (\"Phantomato of the Opera\"), Tiny Toon Adventures, Animaniacs, The Pirates of Dark Water, Hammerman, Little Shop, and more — all captured from WOC Davenport and other local stations, making it an authentic time capsule of early-90s Saturday morning TV.",
    thumbnail: "https://archive.org/services/img/fox-kids-1992-3-vhs-off-airs-woc",
    featured: false,
    episodes: [
      {
        id: "fox-kids-1992-vhs-woc-tape",
        title: "FOX Kids 1992–3 VHS Off-Airs (WOC)",
        season: 0,
        episode: 0,
        year: 1992,
        duration: "180 min",
        description:
          "Off-air VHS recordings from FOX Kids and ABC Saturday Morning, 1992–1994. Features Batman: The Animated Series premiere, Darkwing Duck, Beetlejuice, Tiny Toon Adventures, Animaniacs, Attack of the Killer Tomatoes, The Pirates of Dark Water, Hammerman, Little Shop, and original era commercials.",
        archiveId: "fox-kids-1992-3-vhs-off-airs-woc",
        thumbnail: "https://archive.org/services/img/fox-kids-1992-3-vhs-off-airs-woc",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     CBS SATURDAY MORNINGS VHS  (1992–93)
     Off-air VHS recording of the CBS Saturday Morning block captured
     from WEYI (Saginaw/Flint, MI). Contains partial/full episodes of
     Disney's Raw Toonage, The Little Mermaid, TMNT, and Cyber C.O.P.S.,
     plus original era commercials.
     Archive identifier: vts-01-1_20230709_0957
     ──────────────────────────────────────────────────────────── */
  {
    id: "cbs-saturday-mornings-1992",
    type: "movie",
    title: "CBS Saturday Mornings VHS (1992–93)",
    years: "1992",
    genre: ["Animation", "Family", "Kids"],
    rating: "TV-Y",
    score: 7.8,
    description:
      "A rare off-air VHS recording of the CBS Saturday Morning cartoon block, captured from WEYI in the Saginaw/Flint, Michigan area during the 1992–93 season. The tape preserves segments and episodes from Disney's Raw Toonage (featuring Bonkers and Marsupilami), a complete episode of Disney's The Little Mermaid (\"Double Bubble\"), a partial episode of Teenage Mutant Ninja Turtles (\"Super Irma\"), Cyber C.O.P.S., and Goofy's Guide to the Olympics — all with original period commercials intact, making it a genuine time capsule of early-90s Saturday morning television.",
    thumbnail: "https://archive.org/services/img/vts-01-1_20230709_0957",
    featured: false,
    episodes: [
      {
        id: "cbs-saturday-mornings-1992-tape",
        title: "CBS Saturday Mornings VHS (1992–93)",
        season: 0,
        episode: 0,
        year: 1992,
        duration: "120 min",
        description:
          "Full VHS recording of the CBS Saturday Morning block from WEYI (1992–93), featuring Disney's Raw Toonage, The Little Mermaid (\"Double Bubble\"), Teenage Mutant Ninja Turtles (\"Super Irma\"), Cyber C.O.P.S., Goofy's Guide to the Olympics, and original era commercials.",
        archiveId: "vts-01-1_20230709_0957",
        thumbnail: "https://archive.org/services/img/vts-01-1_20230709_0957",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     WALT DISNEY CARTOON CLASSICS: SPECIAL EDITION '88  (1988)
     Walt Disney Home Video VHS compilation of classic shorts.
     Archive identifier: 652_20220128
     ──────────────────────────────────────────────────────────── */
  {
    id: "disney-cartoon-classics-special-edition-1988",
    type: "movie",
    title: "Walt Disney Cartoon Classics: Special Edition '88",
    years: "1988",
    genre: ["Animation", "Comedy", "Family"],
    rating: "G",
    score: 7.6,
    description:
      "A delightful 1988 Walt Disney Home Video compilation showcasing four golden-age animated shorts: Mickey and Pluto encounter a playful stowaway baby seal in \"Mickey and the Seal\" (1948); Pluto tangles with a bee guarding its bubble gum in \"Bubble Bee\" (1949); Mickey, Donald, and Goofy's road trip spirals into slapstick chaos in \"Mickey's Trailer\" (1938); and Chip 'n' Dale wage an all-out war against Donald Duck over a stash of nuts in \"All in a Nutshell\" (1949). A perfect sampler of Disney's golden age of animation.",
    thumbnail: "https://archive.org/services/img/652_20220128",
    featured: false,
    episodes: [
      {
        id: "disney-cartoon-classics-special-edition-1988-full",
        title: "Walt Disney Cartoon Classics: Special Edition '88",
        season: 0,
        episode: 0,
        year: 1988,
        duration: "30 min",
        description:
          "Four classic Disney shorts: \"Mickey and the Seal\" (1948), \"Bubble Bee\" (1949), \"Mickey's Trailer\" (1938), and \"All in a Nutshell\" (1949) — featuring Mickey, Donald, Goofy, Pluto, and Chip 'n' Dale.",
        archiveId: "652_20220128",
        thumbnail: "https://archive.org/services/img/652_20220128",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     FELIX THE CAT: THE MOVIE  (1988)
     Animated fantasy adventure film directed by Tibor Hernádi.
     Archive identifier: y-2-mate.is-felix-the-cat-the-movie-1988-x-bgwf-av-gqky-1080p-1640523499322
     ──────────────────────────────────────────────────────────── */
  {
    id: "felix-the-cat-the-movie-1988",
    type: "movie",
    title: "Felix the Cat: The Movie",
    years: "1988",
    genre: ["Animation", "Adventure", "Fantasy", "Family"],
    rating: "G",
    score: 5.2,
    description:
      "When the magical Kingdom of Oriana is overrun by the evil Duke of Zill and his army of mechanical minions, Princess Oriana's desperate plea crosses dimensions and summons Felix the Cat — armed with his trusty magic bag of tricks. Transported to a surreal world of circuses, cyborg soldiers, and sorcery, Felix must outwit traitors, escape a nefarious circus master, and ultimately confront the Duke himself to free the kingdom. A wildly eccentric animated fantasy co-produced across the US, West Germany, Hungary, Poland, Bulgaria, and Canada.",
    thumbnail:
      "https://archive.org/services/img/y-2-mate.is-felix-the-cat-the-movie-1988-x-bgwf-av-gqky-1080p-1640523499322",
    featured: false,
    episodes: [
      {
        id: "felix-the-cat-the-movie-1988-full",
        title: "Felix the Cat: The Movie",
        season: 0,
        episode: 0,
        year: 1988,
        duration: "82 min",
        description:
          "Felix the Cat is whisked to the Kingdom of Oriana to rescue Princess Oriana from her tyrannical uncle, the Duke of Zill, using his magic bag of tricks in this surreal animated fantasy adventure.",
        archiveId:
          "y-2-mate.is-felix-the-cat-the-movie-1988-x-bgwf-av-gqky-1080p-1640523499322",
        thumbnail:
          "https://archive.org/services/img/y-2-mate.is-felix-the-cat-the-movie-1988-x-bgwf-av-gqky-1080p-1640523499322",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     WALT DISNEY CARTOON CLASSICS: HAPPY SUMMER DAYS  (1992)
     VHS compilation of summer-themed Disney shorts, released June 19, 1992.
     Archive identifier: walt-disney-cartoon-classics-special-edition-happy-summer-days-1992
     ──────────────────────────────────────────────────────────── */
  {
    id: "disney-happy-summer-days-1992",
    type: "movie",
    title: "Walt Disney Cartoon Classics: Happy Summer Days",
    years: "1992",
    genre: ["Animation", "Comedy", "Family"],
    rating: "G",
    score: 7.5,
    description:
      "A digitally restored compilation of four summer-themed Disney cartoon classics: Goofy tackles a surprise lion on a camping trip in \"Father's Lion\" (1952); Donald Duck's picnic is hijacked by an army of ants in \"Tea for Two Hundred\" (1948); Mickey and Pluto's peaceful day at the beach is ruined by a mischievous seagull in \"The Simple Things\" (1953); and Goofy's driving vacation becomes a series of comic disasters in \"Two Weeks Vacation\" (1952).",
    thumbnail: "https://archive.org/services/img/walt-disney-cartoon-classics-special-edition-happy-summer-days-1992",
    featured: false,
    episodes: [
      {
        id: "disney-happy-summer-days-1992-full",
        title: "Walt Disney Cartoon Classics: Happy Summer Days",
        season: 0,
        episode: 0,
        year: 1992,
        duration: "30 min",
        description:
          "Four digitally restored Disney summer shorts: \"Father's Lion\" (Goofy, 1952), \"Tea for Two Hundred\" (Donald Duck, 1948), \"The Simple Things\" (Mickey & Pluto, 1953), and \"Two Weeks Vacation\" (Goofy, 1952).",
        archiveId: "walt-disney-cartoon-classics-special-edition-happy-summer-days-1992",
        thumbnail: "https://archive.org/services/img/walt-disney-cartoon-classics-special-edition-happy-summer-days-1992",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     TINY TOON ADVENTURES: HOW I SPENT MY VACATION  (1992)
     First US direct-to-video animated feature, Warner Home Video.
     Archive identifier: tiny-toon-adventures-how-i-spent-my-vacation-1992-warner-home-video-vhs_202507
     ──────────────────────────────────────────────────────────── */
  {
    id: "tiny-toon-vacation-1992",
    type: "movie",
    title: "Tiny Toon Adventures: How I Spent My Vacation",
    years: "1992",
    genre: ["Animation", "Comedy", "Family"],
    rating: "G",
    score: 7.9,
    description:
      "The first feature-length direct-to-video animated film in U.S. history, produced by Amblin Entertainment and Warner Bros. Animation. Summer break begins at Acme Looniversity and the Tiny Toons scatter for their wildest vacation yet: Buster and Babs Bunny's water pistol fight floods Acme Acres and sends them on a raucous river adventure through the American South; Plucky Duck endures an agonizing family road trip to HappyWorldLand with Hamton's family; Fifi La Fume chases her movie-star skunk crush; Elmyra terrorizes a safari park; and Fowlmouth drags Shirley the Loon to the worst movie imaginable. Featuring hi-fi Dolby Surround Stereo.",
    thumbnail: "https://archive.org/services/img/tiny-toon-adventures-how-i-spent-my-vacation-1992-warner-home-video-vhs_202507",
    featured: false,
    episodes: [
      {
        id: "tiny-toon-vacation-1992-full",
        title: "Tiny Toon Adventures: How I Spent My Vacation",
        season: 0,
        episode: 0,
        year: 1992,
        duration: "80 min",
        description:
          "Buster and Babs flood Acme Acres; Plucky suffers the family road trip from hell; Fifi pursues a movie-star skunk; Elmyra runs amok at a safari park; and Fowlmouth and Shirley endure the worst movie ever — all in one epic summer vacation.",
        archiveId: "tiny-toon-adventures-how-i-spent-my-vacation-1992-warner-home-video-vhs_202507",
        thumbnail: "https://archive.org/services/img/tiny-toon-adventures-how-i-spent-my-vacation-1992-warner-home-video-vhs_202507",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     X-MEN: NIGHT OF THE SENTINELS  (1992)
     Two-part pilot of X-Men: The Animated Series (Fox Kids, 1992).
     Archive identifier: x-men-nightofthesentinels
     ──────────────────────────────────────────────────────────── */
  {
    id: "xmen-night-of-sentinels-1992",
    type: "movie",
    title: "X-Men: Night of the Sentinels",
    years: "1992",
    genre: ["Animation", "Action", "Sci-Fi", "Superhero"],
    rating: "TV-Y7",
    score: 8.7,
    description:
      "The landmark two-part pilot of X-Men: The Animated Series (Fox Kids, 1992). Jubilee, a teenage mutant, is hunted by giant Sentinel robots after her foster parents unknowingly report her to the Mutant Control Agency. Rescued by Cyclops, Storm, and Rogue, she is brought to the X-Mansion where Professor Xavier's team — Wolverine, Beast, Gambit, and Morph — devise a daring raid on the Agency's files. The mission turns deadly: Morph is apparently killed and Beast is captured, forcing Jubilee to choose where she truly belongs. Praised for its mature themes of prejudice and sacrifice, this pilot set the tone for one of the greatest superhero animated series ever made.",
    thumbnail: "https://archive.org/services/img/x-men-nightofthesentinels",
    featured: true,
    episodes: [
      {
        id: "xmen-sentinels-part1",
        title: "Night of the Sentinels, Part I",
        season: 1,
        episode: 1,
        year: 1992,
        duration: "22 min",
        description:
          "Jubilee is pursued by Sentinel robots and rescued by the X-Men. At the Xavier Mansion she discovers a world of mutants — and a government conspiracy targeting them all.",
        archiveId: "x-men-nightofthesentinels",
        thumbnail: "https://archive.org/services/img/x-men-nightofthesentinels",
      },
      {
        id: "xmen-sentinels-part2",
        title: "Night of the Sentinels, Part II",
        season: 1,
        episode: 2,
        year: 1992,
        duration: "22 min",
        description:
          "The X-Men raid the Mutant Control Agency to destroy the mutant registry. The mission goes tragically wrong — Morph is seemingly killed, Beast is captured — but Jubilee finds her place among the team.",
        archiveId: "x-men-nightofthesentinels",
        thumbnail: "https://archive.org/services/img/x-men-nightofthesentinels",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     ABC SATURDAY MORNING CARTOONS  (September 9, 1989 — WOC)
     Off-air VHS recording of the ABC Saturday Morning block,
     September 9, 1989, with original commercials (WOC).
     Archive identifier: vts-01-1_20200825
     ──────────────────────────────────────────────────────────── */
  {
    id: "abc-saturday-morning-1989-09-09",
    type: "movie",
    title: "ABC Saturday Morning Cartoons (September 9, 1989 — WOC)",
    years: "1989",
    genre: ["Animation", "Comedy", "Family", "Kids"],
    rating: "TV-Y",
    score: 8.0,
    description:
      "A complete off-air VHS recording of the ABC Saturday Morning cartoon block as broadcast on September 9, 1989 — with original commercials intact (WOC). The premiere day of the fall 1989 season features A Pup Named Scooby-Doo, Disney's Adventures of the Gummi Bears, The New Adventures of Winnie the Pooh, Slimer! and the Real Ghostbusters, Beetlejuice, and The Bugs Bunny & Tweety Show. A vivid time capsule of the last great era of network Saturday morning television, complete with period toy, cereal, and movie advertisements.",
    thumbnail: "https://archive.org/services/img/vts-01-1_20200825",
    featured: false,
    episodes: [
      {
        id: "abc-saturday-1989-09-09-tape",
        title: "ABC Saturday Morning Cartoons — September 9, 1989",
        season: 0,
        episode: 0,
        year: 1989,
        duration: "270 min",
        description:
          "Full broadcast block with original commercials: A Pup Named Scooby-Doo, Gummi Bears, The New Adventures of Winnie the Pooh, Slimer! and the Real Ghostbusters, Beetlejuice, and The Bugs Bunny & Tweety Show — the opening Saturday of ABC's fall 1989 season.",
        archiveId: "vts-01-1_20200825",
        thumbnail: "https://archive.org/services/img/vts-01-1_20200825",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE GREAT MOUSE DETECTIVE  (1986 / 1992 VHS)
     Walt Disney Classics Black Diamond VHS reissue (July 1992).
     Archive identifier: the-great-mouse-detective-1992-vhs_202104
     ──────────────────────────────────────────────────────────── */
  {
    id: "great-mouse-detective-1986",
    type: "movie",
    title: "The Great Mouse Detective",
    years: "1986",
    genre: ["Animation", "Adventure", "Comedy", "Family", "Mystery"],
    rating: "G",
    score: 7.6,
    description:
      "Set in Victorian London, young Olivia Flaversham enlists the brilliant detective mouse Basil of Baker Street — and his steadfast companion Dr. Dawson — to find her kidnapped toymaker father. Their investigation uncovers the diabolical scheme of the evil Professor Ratigan, who plans to replace the Mouse Queen with a mechanical impostor and seize control of all Mousedom. Directed by John Musker, Ron Clements, Dave Michener & Burny Mattinson; featuring the unforgettable voice of Vincent Price as Ratigan. The 1992 Walt Disney Classics VHS reissue includes a sneak peek at Aladdin.",
    thumbnail: "https://archive.org/services/img/the-great-mouse-detective-1992-vhs_202104",
    featured: false,
    episodes: [
      {
        id: "great-mouse-detective-1986-full",
        title: "The Great Mouse Detective",
        season: 0,
        episode: 0,
        year: 1986,
        duration: "74 min",
        description:
          "Basil of Baker Street and Dr. Dawson race to rescue Olivia's father and stop the villainous Professor Ratigan from overthrowing the Mouse Queen in this classic Disney animated adventure.",
        archiveId: "the-great-mouse-detective-1992-vhs_202104",
        thumbnail: "https://archive.org/services/img/the-great-mouse-detective-1992-vhs_202104",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     101 DALMATIANS  (1961 / 1992 VHS, French-Canadian)
     Walt Disney animated classic, Quebec French dub VHS copy.
     Archive identifier: 101-dalmatians-1992-vhs-french-canadian-copy_202301
     ──────────────────────────────────────────────────────────── */
  {
    id: "101-dalmatians-1961",
    type: "movie",
    title: "101 Dalmatians (French-Canadian VHS)",
    years: "1961",
    genre: ["Animation", "Adventure", "Comedy", "Family"],
    rating: "G",
    score: 7.7,
    description:
      "Disney's beloved 1961 animated classic in a rare Quebec French-language VHS edition. Pongo and Perdita's litter of puppies — along with 84 others — are stolen by the flamboyantly villainous Cruella De Vil, who desires a dalmatian-fur coat. Their human and canine friends must mount a daring rescue across the English countryside. Directed by Clyde Geronimi, Hamilton Luske & Wolfgang Reitherman, with music by George Bruns and the iconic title song by Bill Lee. This 1992 VHS pressing features the Quebec French dub.",
    thumbnail: "https://archive.org/services/img/101-dalmatians-1992-vhs-french-canadian-copy_202301",
    featured: false,
    episodes: [
      {
        id: "101-dalmatians-1961-full",
        title: "101 Dalmatians (Version française — Québec)",
        season: 0,
        episode: 0,
        year: 1961,
        duration: "79 min",
        description:
          "Pongo and Perdita's puppies are kidnapped by Cruella De Vil in this Disney animated classic, presented in the Quebec French dub from the 1992 VHS release.",
        archiveId: "101-dalmatians-1992-vhs-french-canadian-copy_202301",
        thumbnail: "https://archive.org/services/img/101-dalmatians-1992-vhs-french-canadian-copy_202301",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     GARFIELD AND FRIENDS  (1988–1994)
     CBS Saturday Morning animated series. S5E15 available on archive.
     Archive identifier: 088ghostofachanceroygetssackedrevengeofthelivinglunchdvdripxvidphz
     ──────────────────────────────────────────────────────────── */
  {
    id: "garfield-and-friends",
    type: "movie",
    title: "Garfield and Friends",
    years: "1988",
    genre: ["Animation", "Comedy", "Family"],
    rating: "TV-Y",
    score: 7.8,
    description:
      "Jim Davis's beloved comic strip cat comes to Saturday morning television in this CBS staple that ran from 1988 to 1994. Each half-hour episode weaves together Garfield shorts — showcasing the lasagna-loving, Monday-hating tabby alongside Jon Arbuckle and Odie — with U.S. Acres (Orson's Farm) segments starring a cast of barnyard animals including Roy Rooster, Wade Duck, and Orson Pig. Produced by Film Roman with Lorenzo Music as the voice of Garfield, the series ran 7 seasons and 121 episodes, offering gentle slapstick, fairy-tale parodies, and sharp pop-culture wit.",
    thumbnail: "https://archive.org/services/img/088ghostofachanceroygetssackedrevengeofthelivinglunchdvdripxvidphz",
    featured: false,
    episodes: [
      {
        id: "garfield-s5e15",
        title: "Ghost of a Chance / Roy Gets Sacked / Revenge of the Living Lunch",
        season: 5,
        episode: 15,
        year: 1992,
        duration: "22 min",
        description:
          "Three segments: a rookie ghost is assigned to haunt Garfield's house; Roy quits the farm and joins the Buddy Bears after thinking his friends want to fire him; and a meteorite mistaken for a fruitcake brings the refrigerator contents to life.",
        archiveId: "088ghostofachanceroygetssackedrevengeofthelivinglunchdvdripxvidphz",
        thumbnail: "https://archive.org/services/img/088ghostofachanceroygetssackedrevengeofthelivinglunchdvdripxvidphz",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     ATTACK OF THE KILLER TOMATOES  (1990–1991)
     Fox Kids animated series based on the cult-classic films.
     Archive identifier: 03-s-1-e-03-tomato-from-the-black-lagoon-19900922-vhs-1pq-98-xvid-512x-384
     ──────────────────────────────────────────────────────────── */
  {
    id: "attack-killer-tomatoes-1990",
    type: "movie",
    title: "Attack of the Killer Tomatoes",
    years: "1990",
    genre: ["Animation", "Comedy", "Sci-Fi", "Family"],
    rating: "TV-Y7",
    score: 7.1,
    description:
      "Based on the cult-classic films, this Fox Kids animated series ran from 1990 to 1991 and is set in the town of San Zucchini, five years after the Great Tomato War. Young hero Chad Finletter battles the schemes of the mad Dr. Putrid T. Gangreen (voiced by John Astin), who creates anthropomorphic killer tomato mutants to conquer the world. Aided by Tara — a human/tomato hybrid — the fuzzy tomato F.T., and his uncle Wilbur, Chad faces a new tomato menace each week. Season 2 was a technical milestone, being one of the first Saturday morning series to use computer-assisted animation.",
    thumbnail: "https://archive.org/services/img/03-s-1-e-03-tomato-from-the-black-lagoon-19900922-vhs-1pq-98-xvid-512x-384",
    featured: false,
    episodes: [
      {
        id: "killer-tomatoes-s1e3",
        title: "Tomato from the Black Lagoon",
        season: 1,
        episode: 3,
        year: 1990,
        duration: "22 min",
        description:
          "A monstrous tomato rises from a lagoon — parodying the classic creature feature — as Dr. Gangreen's latest mutant creation terrorizes San Zucchini, and Chad and Tara must stop it before it's too late. Originally aired September 22, 1990.",
        archiveId: "03-s-1-e-03-tomato-from-the-black-lagoon-19900922-vhs-1pq-98-xvid-512x-384",
        thumbnail: "https://archive.org/services/img/03-s-1-e-03-tomato-from-the-black-lagoon-19900922-vhs-1pq-98-xvid-512x-384",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     SPACECAMP  (1986)
     Single feature film — archive identifier: kids-space-camp-1986-family-comedy
     ──────────────────────────────────────────────────────────── */
  {
    id: "spacecamp-1986",
    type: "movie",
    title: "SpaceCamp",
    years: "1986",
    genre: ["Adventure", "Comedy", "Family", "Sci-Fi"],
    rating: "PG",
    score: 6.5,
    description:
      "A group of teenagers attending NASA's U.S. Space Camp in Huntsville, Alabama are accidentally launched into orbit aboard the Space Shuttle Atlantis. Guided by their instructor, the unlikely crew must use their training to survive and find a way back to Earth. Stars Kate Capshaw, Lea Thompson, and a young Joaquin Phoenix.",
    thumbnail: "https://archive.org/services/img/kids-space-camp-1986-family-comedy",
    featured: true,
    episodes: [
      {
        id: "spacecamp-1986-full",
        title: "SpaceCamp",
        season: 0,
        episode: 0,
        year: 1986,
        duration: "107 min",
        description:
          "A group of young Space Camp attendees are accidentally launched into orbit aboard the Space Shuttle Atlantis and must rely on their training to return safely to Earth.",
        archiveId: "kids-space-camp-1986-family-comedy",
        thumbnail: "https://archive.org/services/img/kids-space-camp-1986-family-comedy",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     USA CHANNEL — STAR WARS TRILOGY HOLIDAY MOVIE SPECIAL
     CHRISTMAS MARATHON  (1993)
     Single feature recording — archive identifier:
     starwarstrilogyholidaymoviespecialchristmasmarathon
     VHS-to-digital capture of the USA Channel's holiday broadcast
     of all three original Star Wars films in one marathon sitting,
     December 1993. Includes original commercials and network bumpers.
     ──────────────────────────────────────────────────────────── */
  {
    id: "star-wars-trilogy-usa-marathon-1993",
    type: "movie",
    title: "Star Wars Trilogy Holiday Movie Special (USA Channel 1993)",
    years: "1993",
    genre: ["Adventure", "Sci-Fi", "Fantasy", "Family"],
    rating: "PG",
    score: 9.0,
    description:
      "A rare VHS recording of the USA Channel's Star Wars Trilogy Holiday Movie Special Christmas Marathon, broadcast in December 1993. All three original films — A New Hope, The Empire Strikes Back, and Return of the Jedi — aired back-to-back in one uninterrupted holiday event, complete with period commercials and network bumpers. A nostalgic time-capsule of 1990s cable television and a beloved annual tradition for Star Wars fans.",
    thumbnail: "https://archive.org/services/img/starwarstrilogyholidaymoviespecialchristmasmarathon",
    featured: true,
    episodes: [
      {
        id: "star-wars-trilogy-usa-marathon-1993-full",
        title: "Star Wars Trilogy Holiday Movie Special — Full Marathon",
        season: 0,
        episode: 0,
        year: 1993,
        duration: "approx. 9 hr",
        description:
          "The complete USA Channel Christmas 1993 broadcast of the original Star Wars trilogy (A New Hope, The Empire Strikes Back, Return of the Jedi) with original 1993 commercials and network bumpers intact.",
        archiveId: "starwarstrilogyholidaymoviespecialchristmasmarathon",
        thumbnail: "https://archive.org/services/img/starwarstrilogyholidaymoviespecialchristmasmarathon",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     NATIONAL GEOGRAPHIC VIDEO: ATOCHA — QUEST FOR TREASURE  (1986)
     YouTube identifier: g7jey7YKYp0
     Documentary following treasure hunter Mel Fisher's epic search
     for the 1622 Spanish galleon Nuestra Señora de Atocha. Originally
     released as a National Geographic LaserDisc special.
     ──────────────────────────────────────────────────────────── */
  {
    id: "nat-geo-atocha-1986",
    type: "movie",
    title: "National Geographic: Atocha — Quest for Treasure",
    years: "1986",
    genre: ["Documentary", "Adventure", "History"],
    rating: "G",
    score: 7.8,
    description:
      "Follow legendary treasure hunter Mel Fisher on his extraordinary 16-year quest to find the Nuestra Señora de Atocha, a Spanish galleon loaded with silver and gold that sank in the Florida Keys in 1622. This National Geographic documentary captures the obsession, heartbreak, and ultimate triumph of one of history's greatest treasure hunts.",
    thumbnail: "https://img.youtube.com/vi/g7jey7YKYp0/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "nat-geo-atocha-1986-full",
        title: "Atocha — Quest for Treasure",
        season: 0,
        episode: 0,
        year: 1986,
        duration: "75 min",
        description:
          "Mel Fisher's 16-year search for the Atocha, a treasure-laden Spanish galleon lost in the Florida Keys in 1622, captured in this National Geographic documentary.",
        youtubeId: "g7jey7YKYp0",
        thumbnail: "https://img.youtube.com/vi/g7jey7YKYp0/hqdefault.jpg",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE REAL GHOSTBUSTERS  (1986–1991)
     Archive identifier: the-real-ghostbusters
     Animated series based on the hit 1984 film. Follows Peter
     Venkman, Egon Spengler, Ray Stantz, Winston Zeddemore, Janine
     Melnitz, and Slimer as they bust ghosts across New York City.
     Season 1 = 13 episodes, indices 0–12.
     ──────────────────────────────────────────────────────────── */
  {
    id: "real-ghostbusters",
    title: "The Real Ghostbusters",
    years: "1986–1991",
    genre: ["Animation", "Comedy", "Fantasy"],
    rating: "TV-Y7",
    score: 8.1,
    description:
      "The continuing adventures of Peter Venkman, Egon Spengler, Ray Stantz, Winston Zeddemore, and their spooky green mascot Slimer as they battle ghosts, demons, and supernatural forces threatening New York City. The beloved animated spin-off of the original Ghostbusters film, featuring sharp writing, mythology-rich storylines, and plenty of laughs.",
    thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
    featured: true,
    episodes: [
      {
        id: "rgb-s01e01", title: "Ghosts R Us", season: 1, episode: 1,
        year: 1986, duration: "22 min",
        description: "Three ghosts accidentally freed from the Containment Unit set up a rival ghostbusting business called Ghosts R Us to put the team out of work.",
        archiveId: "the-real-ghostbusters", archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e02", title: "Killerwatt", season: 1, episode: 2,
        year: 1986, duration: "22 min",
        description: "A supernatural entity takes over New York's electrical grid, plunging the city into chaos as the Ghostbusters scramble to stop the power-hungry ghost.",
        archiveId: "the-real-ghostbusters", archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e03", title: "Mrs. Roger's Neighborhood", season: 1, episode: 3,
        year: 1986, duration: "22 min",
        description: "The Ghostbusters are called to an elderly woman's home, only to find a sinister entity has taken control of the entire neighborhood.",
        archiveId: "the-real-ghostbusters", archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e04", title: "Slimer, Come Home", season: 1, episode: 4,
        year: 1986, duration: "22 min",
        description: "After being blamed for mischief at the firehouse, Slimer runs away and falls in with a gang of rogue poltergeists, forcing the Ghostbusters to mount a rescue.",
        archiveId: "the-real-ghostbusters", archiveIndex: 3,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e05", title: "Troll Bridge", season: 1, episode: 5,
        year: 1986, duration: "22 min",
        description: "A clan of trolls seizes the Queensboro Bridge and won't let traffic pass until the Ghostbusters track down their runaway cousin.",
        archiveId: "the-real-ghostbusters", archiveIndex: 4,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e06", title: "The Boogieman Cometh", season: 1, episode: 6,
        year: 1986, duration: "22 min",
        description: "The Boogieman — a monster from Egon's own childhood nightmares — returns to terrorize two children, and the Ghostbusters must venture into his terrifying realm to stop him.",
        archiveId: "the-real-ghostbusters", archiveIndex: 5,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e07", title: "Mr. Sandman, Dream Me a Dream", season: 1, episode: 7,
        year: 1986, duration: "22 min",
        description: "The Sandman believes the world would be better off asleep for 500 years, and as his enchanted dust spreads across the city, people's dreams start coming dangerously to life.",
        archiveId: "the-real-ghostbusters", archiveIndex: 6,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e08", title: "When Halloween Was Forever", season: 1, episode: 8,
        year: 1986, duration: "22 min",
        description: "The ancient spirit Samhain is unleashed on Halloween night and intends to make the holiday last forever, flooding New York with supernatural creatures.",
        archiveId: "the-real-ghostbusters", archiveIndex: 7,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e09", title: "Look Homeward, Ray", season: 1, episode: 9,
        year: 1986, duration: "22 min",
        description: "Ray returns to his hometown as a local hero, but a botched ghostbusting job shakes his confidence — and only he can save the day if he believes in himself again.",
        archiveId: "the-real-ghostbusters", archiveIndex: 8,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e10", title: "Take Two", season: 1, episode: 10,
        year: 1986, duration: "22 min",
        description: "The Ghostbusters head to Hollywood as consultants on a movie about their exploits, but real ghosts invade the studio lot — and the team accidentally grabs prop proton packs.",
        archiveId: "the-real-ghostbusters", archiveIndex: 9,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e11", title: "Citizen Ghost", season: 1, episode: 11,
        year: 1986, duration: "22 min",
        description: "A flashback episode revealing how Slimer first came to live at the Ghostbusters' firehouse — set immediately after the events of the original film.",
        archiveId: "the-real-ghostbusters", archiveIndex: 10,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e12", title: "Janine's Genie", season: 1, episode: 12,
        year: 1986, duration: "22 min",
        description: "Janine accepts a mysterious lamp as payment for a job and accidentally frees a mischievous genie, getting a very unwanted taste of life as a Ghostbuster.",
        archiveId: "the-real-ghostbusters", archiveIndex: 11,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
      {
        id: "rgb-s01e13", title: "Xmas Marks the Spot", season: 1, episode: 13,
        year: 1986, duration: "22 min",
        description: "The Ghostbusters accidentally travel back to Victorian England and capture the three spirits of A Christmas Carol, erasing the classic story from history — and ruining Christmas forever unless they can set things right.",
        archiveId: "the-real-ghostbusters", archiveIndex: 12,
        thumbnail: "https://archive.org/services/img/the-real-ghostbusters",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     SUPERGIRL (1984) — ABC BROADCAST  (1987-02-28)
     Archive identifier: Supergirl_ABC_WOC_OTA_1987-02-28_Incomplete
     Off-air VHS recording of the ABC broadcast of the 1984
     Supergirl theatrical film, with original commercials intact
     (WOC = With Original Commercials, OTA = Over The Air).
     Recording is marked incomplete.
     ──────────────────────────────────────────────────────────── */
  {
    id: "supergirl-1984-abc-1987",
    type: "movie",
    title: "Supergirl (1984)",
    years: "1984",
    genre: ["Action", "Sci-Fi", "Fantasy"],
    rating: "PG",
    score: 6.1,
    description:
      "Helen Slater stars as Kara Zor-El, cousin of Superman, who travels to Earth to retrieve a powerful Kryptonian artifact and winds up battling the sorceress Selena (Faye Dunaway) in order to save both worlds. Watch the full theatrical cut or a rare off-air VHS capture of the February 28, 1987 ABC broadcast — complete with original commercials and a vivid mid-80s time-capsule feel.",
    thumbnail: "https://img.youtube.com/vi/VFOPfODwaug/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "supergirl-1984-full-movie",
        title: "Supergirl — Full Movie (1984)",
        season: 0,
        episode: 1,
        year: 1984,
        duration: "124 min",
        description:
          "The complete 1984 theatrical cut of Supergirl. Kara Zor-El (Helen Slater) comes to Earth in search of a powerful Kryptonian energy source and must face the evil sorceress Selena (Faye Dunaway). Also starring Peter O'Toole and Mia Farrow.",
        youtubeId: "VFOPfODwaug",
        thumbnail: "https://img.youtube.com/vi/VFOPfODwaug/hqdefault.jpg",
      },
      {
        id: "supergirl-1984-abc-1987-full",
        title: "Supergirl — ABC Broadcast (Feb 28, 1987, WOC)",
        season: 0,
        episode: 2,
        year: 1987,
        duration: "~124 min",
        description:
          "The 1984 Supergirl theatrical film as broadcast on ABC, February 28, 1987 — with original period commercials intact. Starring Helen Slater, Faye Dunaway, Peter O'Toole, and Mia Farrow. Recording is incomplete.",
        archiveId: "Supergirl_ABC_WOC_OTA_1987-02-28_Incomplete",
        thumbnail: "https://archive.org/services/img/Supergirl_ABC_WOC_OTA_1987-02-28_Incomplete",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE INCREDIBLE HULK (1966 Animated Series)
     Archive identifier: the-incredble-hulk-1966-complete-series-english
     Part of The Marvel Super Heroes anthology. Each episode
     comprises three ~7-minute segments adapted from Stan Lee &
     Jack Kirby's early Hulk comics.
     Season 1 (1966): 13 episodes
     ──────────────────────────────────────────────────────────── */
  {
    id: "incredible-hulk-1966",
    title: "The Incredible Hulk (1966)",
    years: "1966",
    genre: ["Action", "Sci-Fi", "Animated"],
    rating: "TV-G",
    score: 7.0,
    description:
      "The first animated incarnation of Marvel's gamma-irradiated behemoth. Physicist Dr. Bruce Banner's accidental exposure to a gamma bomb explosion transforms him into the raging, near-invincible Hulk whenever danger strikes. Adapted faithfully from the early Stan Lee and Jack Kirby comics, each episode tells three serialised stories pitting Banner, Rick Jones, and Betty Ross against villains such as the Leader, the Toadmen, Metal Master, and Tyrannus.",
    thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
    featured: false,
    episodes: [
      {
        id: "hulk66-s01e01",
        title: "The Origin of the Hulk / Enter the Gorgon / To Be a Man",
        season: 1, episode: 1, year: 1966, duration: "22 min",
        description: "Dr. Bruce Banner saves teenager Rick Jones from a gamma bomb blast and is irradiated, triggering his first transformation; the monstrous Gorgon arrives in America to battle the Hulk; Banner attempts to help the Gorgon find a cure for his deformity.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e02",
        title: "Terror of the Toadmen / Wanted for Treason / Hulk Runs Amok",
        season: 1, episode: 2, year: 1966, duration: "22 min",
        description: "Magnetism-wielding alien Toadmen invade Earth and capture Banner; the U.S. military brands Bruce Banner a traitor in the wake of the Toadmen's assault; the Hulk is hunted by General Ross's forces across the country.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e03",
        title: "A Titan Rides the Train / The Horde of Humanoids / On the Rampage!",
        season: 1, episode: 3, year: 1966, duration: "22 min",
        description: "The Leader's synthetic Humanoids hijack a train carrying one of Banner's inventions; the Leader prepares a full-scale invasion with his Humanoid army while Banner is held captive; the Hulk battles the Humanoid horde and reverts to Banner in the chaos.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e04",
        title: "The Power of Dr. Banner / Where Strides the Behemoth / Back from the Dead",
        season: 1, episode: 4, year: 1966, duration: "22 min",
        description: "The military hunts Banner for crimes attributed to the Hulk and he fights to prove his innocence; the Hulk flees to the Himalayas but is captured and reverted to Banner; Banner sees a chance to save Major Talbot and to rid himself of the Hulk forever.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 3,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e05",
        title: "Micro-Monsters / The Lair of the Leader / To Live Again",
        season: 1, episode: 5, year: 1966, duration: "22 min",
        description: "The Hulk battles the Leader's forces to rescue Rick Jones from miniaturised monsters; the Hulk is trapped inside the Leader's high-tech subterranean lair while Rick faces mortal danger; the final battle for Banner's Absorbatron — a device capable of absorbing a nuclear explosion.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 4,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e06",
        title: "Brawn Against Brain / Captured at Last / Enter the Chameleon",
        season: 1, episode: 6, year: 1966, duration: "22 min",
        description: "The Hulk clashes with the intellect-driven Leader in a battle where raw power meets cunning strategy; the military finally succeeds in capturing the Hulk; the shape-shifting Chameleon infiltrates Banner's circle, impersonating allies to defeat the Hulk from within.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 5,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e07",
        title: "Within This Monster Dwells a Man / Another World, Another Foe / The Wisdom of the Watcher",
        season: 1, episode: 7, year: 1966, duration: "22 min",
        description: "The Hulk's internal struggle between Banner's intellect and the monster's rage reaches a crisis point; a new interdimensional threat emerges to challenge the Hulk; the cosmic Watcher observes Banner's dilemma and imparts wisdom about the duality of human nature.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 6,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e08",
        title: "The Space Phantom / Sting of the Wasp / Exit the Hulk",
        season: 1, episode: 8, year: 1966, duration: "22 min",
        description: "The alien Space Phantom, who can assume anyone's form, sows chaos and pits the Hulk against the Avengers; the Wasp enters the fray as the Avengers confront the shape-shifting interloper; the Hulk's uneasy alliance with Earth's Mightiest Heroes collapses and he departs alone.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 7,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e09",
        title: "Hulk vs. Metal Master / The Master Tests His Metal / Mind Over Metal",
        season: 1, episode: 9, year: 1966, duration: "22 min",
        description: "The extraterrestrial Metal Master — with power over every metal on Earth — arrives and the Hulk's brute strength proves no match; Metal Master tests his powers on humanity's infrastructure; Banner's scientific genius devises the only weapon capable of defeating an enemy immune to the Hulk's fists.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 8,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e10",
        title: "The Ringmaster / Captive of the Circus / The Grand Finale",
        season: 1, episode: 10, year: 1966, duration: "22 min",
        description: "The sinister Ringmaster uses his hypnotic disc to enslave the Hulk and force him to perform in his criminal circus; the Hulk struggles to break free while helpless to resist the Ringmaster's mental control; the dramatic showdown inside the big top brings the Ringmaster's reign of terror to an end.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 9,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e11",
        title: "Enter Tyrannus / Beauty and the Beast / They Dwell in the Depths",
        season: 1, episode: 11, year: 1966, duration: "22 min",
        description: "The Hulk is dragged into the subterranean kingdom of the immortal Roman emperor Tyrannus; Betty Ross is captured and the Hulk must navigate Tyrannus's underground realm to rescue her; the Hulk battles monstrous creatures lurking in the earth's deep passages to find his way back to the surface.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 10,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e12",
        title: "Terror of the T-Gun / I Against a World / Bruce Banner is the Hulk",
        season: 1, episode: 12, year: 1966, duration: "22 min",
        description: "A terrifying new gamma weapon called the T-Gun threatens to destroy everything Banner has worked to protect; cornered by both enemies and the military, Banner faces the world alone; the truth about Bruce Banner's double identity edges ever closer to exposure.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 11,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
      {
        id: "hulk66-s01e13",
        title: "The Man Called Boomerang / Hulk Intervenes / Less Than Monster, More Than Man",
        season: 1, episode: 13, year: 1966, duration: "22 min",
        description: "The villainous Boomerang — a supersonic assassin armed with explosive shells — challenges the Hulk in the season finale; the Hulk must intervene in a crisis that tests whether brute strength alone is enough; the series concludes with a meditation on Banner's duality — less than the monster the world fears, yet more than merely human.",
        archiveId: "the-incredble-hulk-1966-complete-series-english", archiveIndex: 12,
        thumbnail: "https://archive.org/services/img/the-incredble-hulk-1966-complete-series-english",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE INCREDIBLE HULK (1994 Animated Series)
     Archive identifier: incredible-hulk-1994-complete-series
     UPN animated series produced by Marvel Films Animation.
     Season 1 (1996): 13 episodes  |  Season 2 (1997): 8 episodes
     ──────────────────────────────────────────────────────────── */
  {
    id: "incredible-hulk-1994",
    title: "The Incredible Hulk (1994)",
    years: "1996–1997",
    genre: ["Action", "Sci-Fi", "Animated"],
    rating: "TV-Y7",
    score: 7.5,
    description:
      "Marvel's animated take on the jolly green giant. Scientist Bruce Banner, cursed to transform into the rampaging Hulk whenever his anger peaks, battles villains, the military, and his own inner demons alongside She-Hulk and Rick Jones. Part of the 1990s Marvel animated universe.",
    thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
    featured: false,
    episodes: [
      /* ── Season 1 (1996) ── */
      {
        id: "hulk94-s01e01",
        title: "The Return of the Beast (Part 1)",
        season: 1, episode: 1, year: 1996, duration: "23 min",
        description: "Bruce Banner returns to the Gamma Base and must once again become the Hulk to stop the Leader from seizing a powerful gamma weapon.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e02",
        title: "The Return of the Beast (Part 2)",
        season: 1, episode: 2, year: 1996, duration: "23 min",
        description: "The Hulk battles the Leader's forces and faces General Ross, who is determined to capture Banner once and for all.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e03",
        title: "Helping Hand, Iron Fist",
        season: 1, episode: 3, year: 1996, duration: "23 min",
        description: "Iron Man crosses paths with the Hulk when both heroes converge on a dangerous gamma-powered arms deal.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e04",
        title: "Man to Man, Beast to Beast",
        season: 1, episode: 4, year: 1996, duration: "23 min",
        description: "The Hulk encounters the Man-Thing in a Florida swamp and must prevent the creature from being weaponised by a shadowy organisation.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 3,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e05",
        title: "Raw Power",
        season: 1, episode: 5, year: 1996, duration: "23 min",
        description: "Zzzax — a being of pure electrical energy — threatens the power grid, and only the Hulk has the raw strength to stop it.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 4,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e06",
        title: "Darkness and Light (Part 1)",
        season: 1, episode: 6, year: 1996, duration: "23 min",
        description: "Bruce Banner discovers that his gamma-fuelled alter ego may be splintering his mind into multiple personalities — and one of them is murderous.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 5,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e07",
        title: "Darkness and Light (Part 2)",
        season: 1, episode: 7, year: 1996, duration: "23 min",
        description: "As Banner's psyche fractures further, the Grey Hulk persona takes control and pursues its own destructive agenda.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 6,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e08",
        title: "Darkness and Light (Part 3)",
        season: 1, episode: 8, year: 1996, duration: "23 min",
        description: "Banner must unify his fractured psyche before the competing Hulk personalities destroy everything — and everyone — around him.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 7,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e09",
        title: "Innocent Blood",
        season: 1, episode: 9, year: 1996, duration: "23 min",
        description: "The Hulk is framed for a brutal attack and hunted by both General Ross and a relentless new bounty hunter hired to bring Banner in dead or alive.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 8,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e10",
        title: "Mortal Bounds",
        season: 1, episode: 10, year: 1996, duration: "23 min",
        description: "Rick Jones is infected with a lethal gamma-born virus; only the Hulk can retrieve the cure from the Abomination's lair.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 9,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e11",
        title: "Of Monsters and Men",
        season: 1, episode: 11, year: 1996, duration: "23 min",
        description: "The Hulk reluctantly teams up with Thor when a fearsome new gamma-powered monster threatens both New York and Asgard.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 10,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e12",
        title: "They Call Me Conquest",
        season: 1, episode: 12, year: 1996, duration: "23 min",
        description: "An alien warlord arrives on Earth seeking the Hulk as a trophy; the Hulk must fight for his life — and for Earth's freedom.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 11,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s01e13",
        title: "Doomed",
        season: 1, episode: 13, year: 1996, duration: "23 min",
        description: "Dr. Doom traps the Hulk and the Fantastic Four in an interdimensional labyrinth, forcing uneasy allies to work together to escape.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 12,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      /* ── Season 2 (1997) ── */
      {
        id: "hulk94-s02e01",
        title: "Hex Factor",
        season: 2, episode: 1, year: 1997, duration: "23 min",
        description: "She-Hulk joins Bruce as he faces the Absorbing Man and a mysterious sorceress whose hex powers push the Hulk to his limits.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 13,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s02e02",
        title: "Down Memory Lane",
        season: 2, episode: 2, year: 1997, duration: "23 min",
        description: "Bruce Banner is forced to relive the childhood trauma that shaped both his genius and his curse as the Leader probes his subconscious.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 14,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s02e03",
        title: "Mind Over Anti-Matter",
        season: 2, episode: 3, year: 1997, duration: "23 min",
        description: "The Leader opens a rift to an anti-matter dimension; She-Hulk and the Hulk must close it before both worlds are annihilated.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 15,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s02e04",
        title: "Doomed (Part 1)",
        season: 2, episode: 4, year: 1997, duration: "23 min",
        description: "Doctor Doom returns, now wielding the power of the Silver Surfer, and sets his sights on conquering every dimension in the multiverse.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 16,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s02e05",
        title: "Doomed (Part 2)",
        season: 2, episode: 5, year: 1997, duration: "23 min",
        description: "The Hulk, She-Hulk, and the Fantastic Four mount a desperate last stand against an all-powerful Doctor Doom.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 17,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s02e06",
        title: "Fashion Victims",
        season: 2, episode: 6, year: 1997, duration: "23 min",
        description: "She-Hulk battles the villainous Ogress while Bruce struggles to maintain control after a new gamma experiment goes catastrophically wrong.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 18,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s02e07",
        title: "Innocent Blood (Part 2)",
        season: 2, episode: 7, year: 1997, duration: "23 min",
        description: "The Hulk is put on trial for his past rampages; She-Hulk serves as his defence attorney in a case that could see Banner imprisoned forever.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 19,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
      {
        id: "hulk94-s02e08",
        title: "Crack in the World",
        season: 2, episode: 8, year: 1997, duration: "23 min",
        description: "In the series finale, a catastrophic fault line threatens to split the Earth apart — only the Hulk's immeasurable strength can save the planet.",
        archiveId: "incredible-hulk-1994-complete-series", archiveIndex: 20,
        thumbnail: "https://archive.org/services/img/incredible-hulk-1994-complete-series",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE ERUPTION OF MT. ST. HELENS  (1980)
     Archive identifier: the-eruption-of-mt-st-helens-1980
     Television documentary produced by KATU (Portland, OR) and
     KOMO-TV (Seattle, WA) capturing the May 18, 1980 eruption.
     ──────────────────────────────────────────────────────────── */
  {
    id: "eruption-of-mt-st-helens-1980",
    type: "movie",
    title: "The Eruption of Mt. St. Helens",
    years: "1980",
    genre: ["Documentary", "History"],
    rating: "TV-G",
    score: 8.0,
    description:
      "A gripping television documentary produced by Portland's KATU and Seattle's KOMO-TV in the immediate aftermath of the catastrophic May 18, 1980 eruption of Mount St. Helens. Combining on-the-ground news footage with scientific narration, the film documents the seismic buildup, the cataclysmic lateral blast that flattened hundreds of square miles of forest, the massive pyroclastic flows and lahars, and the human stories of evacuation, survival, and loss. An invaluable piece of broadcast journalism history.",
    thumbnail: "https://archive.org/services/img/the-eruption-of-mt-st-helens-1980",
    featured: false,
    episodes: [
      {
        id: "eruption-mt-st-helens-1980-full",
        title: "The Eruption of Mt. St. Helens",
        season: 0,
        episode: 0,
        year: 1980,
        duration: "50 min",
        description: "News footage and narration chronicle the seismic buildup, the devastating May 18 lateral blast, and the immediate human and environmental aftermath of the most destructive volcanic eruption in U.S. recorded history.",
        archiveId: "the-eruption-of-mt-st-helens-1980",
        thumbnail: "https://archive.org/services/img/the-eruption-of-mt-st-helens-1980",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     ERNEST SCARED STUPID  (1991)
     Archive identifier: Ernest_Scared_Stupid_Ernest_Scared_Straight
     Touchstone Pictures comedy-horror featuring Jim Varney as
     Ernest P. Worrell alongside Eartha Kitt.
     ──────────────────────────────────────────────────────────── */
  {
    id: "ernest-scared-stupid-1991",
    type: "movie",
    title: "Ernest Scared Stupid",
    years: "1991",
    genre: ["Comedy", "Horror", "Family"],
    rating: "PG",
    score: 6.1,
    description:
      "Lovable klutz Ernest P. Worrell (Jim Varney) accidentally breaks an ancient seal and releases Trantor, a hideous troll who turns children into wooden dolls on Halloween night. With the help of his friends and the mysterious Old Lady Hackmore (Eartha Kitt), Ernest must find a way to defeat Trantor and save the kids before it's too late — if his bumbling doesn't doom them all first.",
    thumbnail: "https://archive.org/services/img/Ernest_Scared_Stupid_Ernest_Scared_Straight",
    featured: false,
    episodes: [
      {
        id: "ernest-scared-stupid-1991-full",
        title: "Ernest Scared Stupid",
        season: 0,
        episode: 0,
        year: 1991,
        duration: "91 min",
        description: "Ernest P. Worrell unwittingly unleashes an ancient troll on Halloween. Starring Jim Varney and Eartha Kitt.",
        archiveId: "Ernest_Scared_Stupid_Ernest_Scared_Straight",
        thumbnail: "https://archive.org/services/img/Ernest_Scared_Stupid_Ernest_Scared_Straight",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     GUIDING LIGHT  (1952–2009)
     Archive identifier: guidinglight-1992
     Individual episodes addressed via archiveFile (filename within
     the collection).  GL-15Oct1991.mpg = October 15, 1991 episode.
     ──────────────────────────────────────────────────────────── */
  {
    id: "guiding-light",
    title: "Guiding Light",
    years: "1952–2009",
    genre: ["Drama", "Soap Opera"],
    rating: "TV-PG",
    score: 7.5,
    description:
      "One of the longest-running dramatic serials in broadcasting history, Guiding Light began on radio in 1937 before moving to CBS television in 1952. Set in the fictional town of Springfield, the show followed the intertwined lives of the Bauer, Spaulding, and Lewis families across generations — weaving together romance, family conflict, corporate intrigue, and social issues over more than five decades until its final episode in September 2009.",
    thumbnail: "https://archive.org/services/img/guidinglight-1992",
    featured: false,
    episodes: [
      {
        id: "gl-1991-10-15",
        title: "October 15, 1991",
        season: 1991,
        episode: 1,
        year: 1991,
        duration: "60 min",
        description: "A classic episode of Guiding Light from October 15, 1991, continuing the stories of Springfield's most prominent families.",
        archiveId: "guidinglight-1992",
        archiveFile: "GL-15Oct1991.mpg",
        thumbnail: "https://archive.org/services/img/guidinglight-1992",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     NIRVANA MTV UNPLUGGED IN NEW YORK  (1993)
     Archive identifier: Nirvana_Unplugged_Unedited_1993
     Unedited recording of the November 18, 1993 taping at
     Sony Music Studios, New York City.
     ──────────────────────────────────────────────────────────── */
  {
    id: "nirvana-unplugged-1993",
    type: "movie",
    title: "Nirvana: MTV Unplugged in New York",
    years: "1993",
    genre: ["Music", "Documentary"],
    rating: "TV-PG",
    score: 9.6,
    description:
      "Recorded on November 18, 1993 at Sony Music Studios in New York City, Nirvana's landmark MTV Unplugged performance is widely regarded as one of the greatest live concerts ever captured on film. Kurt Cobain, Krist Novoselic, and Dave Grohl — augmented by Pat Smear and cellist Lori Goldston — delivered an intimate, candle-lit set heavy on deep cuts, covers (David Bowie, The Vaselines, Lead Belly, Meat Puppets), and raw acoustic arrangements that revealed new dimensions in Cobain's songwriting. Broadcast on MTV on December 14, 1993, it remains a definitive document of both the band and the era. This is the unedited full recording of the taping.",
    thumbnail: "https://archive.org/services/img/Nirvana_Unplugged_Unedited_1993",
    featured: false,
    episodes: [
      {
        id: "nirvana-unplugged-1993-full",
        title: "MTV Unplugged in New York (Unedited)",
        season: 0,
        episode: 0,
        year: 1993,
        duration: "75 min",
        description: "The complete unedited taping of Nirvana's historic MTV Unplugged session, recorded November 18, 1993 at Sony Music Studios, New York.",
        archiveId: "Nirvana_Unplugged_Unedited_1993",
        thumbnail: "https://archive.org/services/img/Nirvana_Unplugged_Unedited_1993",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     GHOSTBUSTERS  (1984)
     Archive identifier: ghostbusters-from-the-original-vhs-release-in-1985
     Original 1985 Columbia Pictures Home Entertainment VHS release.
     ──────────────────────────────────────────────────────────── */
  {
    id: "ghostbusters-1984",
    type: "movie",
    title: "Ghostbusters",
    years: "1984",
    genre: ["Comedy", "Horror", "Sci-Fi"],
    rating: "PG",
    score: 8.1,
    description:
      "Three eccentric parapsychology professors — Peter Venkman (Bill Murray), Ray Stantz (Dan Aykroyd), and Egon Spengler (Harold Ramis) — lose their university funding and go into business as freelance ghost catchers in New York City. When supernatural activity in the city suddenly spikes and beautiful cellist Dana Barrett (Sigourney Weaver) finds her refrigerator is a gateway to another dimension, the Ghostbusters realise they are all that stands between the world and an apocalyptic invasion. This is the original 1985 Columbia Pictures Home Entertainment VHS transfer.",
    thumbnail: "https://archive.org/services/img/ghostbusters-from-the-original-vhs-release-in-1985",
    featured: false,
    episodes: [
      {
        id: "ghostbusters-1984-full",
        title: "Ghostbusters",
        season: 0,
        episode: 0,
        year: 1984,
        duration: "105 min",
        description: "Fired from their university, three parapsychologists start a ghost-catching business in New York City and face an ancient deity threatening to destroy the world. Starring Bill Murray, Dan Aykroyd, Harold Ramis, and Sigourney Weaver.",
        archiveId: "ghostbusters-from-the-original-vhs-release-in-1985",
        thumbnail: "https://archive.org/services/img/ghostbusters-from-the-original-vhs-release-in-1985",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     SKI SCHOOL (PART 3)
     Archive identifier: skischoolpart3
     Third entry in the Ski School series.
     ──────────────────────────────────────────────────────────── */
  {
    id: "ski-school-part-3",
    type: "movie",
    title: "Ski School (Part 3)",
    years: "1994",
    genre: ["Comedy"],
    rating: "R",
    score: 5.2,
    description:
      "The irreverent ski-comedy franchise returns for a third outing on the snowy slopes. A new crop of rowdy instructors and eager beginners collide at the mountain resort, trading pranks and rivalries while chasing championships and romance. Packed with slapstick set pieces, après-ski antics, and the sunny, anything-goes spirit that fans of the series have come to expect.",
    thumbnail: "https://archive.org/services/img/skischoolpart3",
    featured: false,
    episodes: [
      {
        id: "ski-school-part-3-full",
        title: "Ski School (Part 3)",
        season: 0,
        episode: 0,
        year: 1994,
        duration: "95 min",
        description: "The slopes come alive again as a new generation of wild ski instructors and hapless beginners battle it out at the mountain resort in this third entry in the Ski School comedy series.",
        archiveId: "skischoolpart3",
        thumbnail: "https://archive.org/services/img/skischoolpart3",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     ER — 1984 PILOT (Parts 1 & 2)
     Archive identifier: e-r-1984-pilot-pts-1-2
     The original two-part television pilot based on Michael
     Crichton's unproduced 1974 screenplay, filmed in 1984 and
     later the creative blueprint for the landmark 1994 NBC series.
     ──────────────────────────────────────────────────────────── */
  {
    id: "er-1984-pilot",
    type: "movie",
    title: "ER: The Pilot (1984)",
    years: "1984",
    genre: ["Drama", "Medical"],
    rating: "TV-PG",
    score: 7.8,
    description:
      "The two-part television pilot that launched one of the most celebrated medical dramas in broadcast history. Based on Michael Crichton's unproduced 1974 screenplay drawn from his own experiences as a medical student, this 1984 production captures the relentless pace and human drama of a big-city hospital emergency room — the template that would be fully realised a decade later when Steven Spielberg and Crichton brought the concept to NBC in 1994. A rare piece of television history: the prototype for ER's ten-year run as appointment viewing.",
    thumbnail: "https://archive.org/services/img/e-r-1984-pilot-pts-1-2",
    featured: false,
    episodes: [
      {
        id: "er-1984-pilot-full",
        title: "ER Pilot — Parts 1 & 2",
        season: 0,
        episode: 0,
        year: 1984,
        duration: "120 min",
        description: "The complete two-part pilot. A frantic night in a city emergency room tests doctors, nurses, and interns to their limits — establishing the fast-cut, multi-storyline style that would define the 1994 series.",
        archiveId: "e-r-1984-pilot-pts-1-2",
        thumbnail: "https://archive.org/services/img/e-r-1984-pilot-pts-1-2",
      },
    ],
  },
  {
    id: "vhs-october-1990-wesh-quantum-leap-night-court",
    type: "vhs",
    title: "VHS Tape — October 1990: Quantum Leap & Night Court (WESH)",
    years: "1990",
    genre: ["Sci-Fi", "Comedy", "Drama", "VHS Recording"],
    rating: "TV-PG",
    score: 8.2,
    description:
      "A home VHS recording from October 1990 captured off WESH, an NBC affiliate in Orlando, Florida. The tape preserves three episodes of Quantum Leap (Season 3) alongside an episode of Night Court and a segment of NBC News at This Hour — all complete with period commercials, network bumpers, and station identifications. An authentic time-capsule of early-1990s broadcast television and a rare off-air record of two beloved NBC Thursday-night staples.",
    thumbnail: "https://archive.org/services/img/vhs-tape-october-1990-wesh-three-quantum-leap-episodes-nbc-news-at-this-hour-night-court",
    featured: false,
    episodes: [
      {
        id: "vhs-1990-wesh-full-tape",
        title: "Full Tape — Quantum Leap, NBC News & Night Court (October 1990)",
        season: 0,
        episode: 0,
        year: 1990,
        duration: "120 min",
        description: "Complete VHS recording from October 1990 off WESH/NBC. Contains three Season 3 Quantum Leap episodes, an NBC News at This Hour segment, and an episode of Night Court — with all original commercials and station breaks intact.",
        archiveId: "vhs-tape-october-1990-wesh-three-quantum-leap-episodes-nbc-news-at-this-hour-night-court",
        thumbnail: "https://archive.org/services/img/vhs-tape-october-1990-wesh-three-quantum-leap-episodes-nbc-news-at-this-hour-night-court",
      },
    ],
  },
  {
    id: "apollo-13-houston-we-have-a-problem-1970",
    type: "documentary",
    title: "Apollo 13: Houston, We Have a Problem (1970)",
    years: "1970",
    genre: ["Documentary", "Space", "History"],
    rating: "G",
    score: 9.0,
    description:
      "NASA's own official documentary account of the Apollo 13 mission, produced in 1970 shortly after the near-catastrophic moon flight. On April 13, 1970, an oxygen tank explosion crippled the command module 200,000 miles from Earth, forcing commander Jim Lovell, Jack Swigert, and Fred Haise to use the lunar module Aquarius as a lifeboat. This film draws on mission footage, cockpit audio, Mission Control recordings, and post-flight interviews to chronicle the four-day struggle to bring the crew home safely — a defining moment for NASA and the world.",
    thumbnail: "https://archive.org/services/img/34062Apollo13HoustonWeHaveAProblem",
    featured: false,
    episodes: [
      {
        id: "apollo-13-houston-we-have-a-problem-full",
        title: "Apollo 13: Houston, We Have a Problem",
        season: 0,
        episode: 0,
        year: 1970,
        duration: "60 min",
        description: "NASA's official documentary of the Apollo 13 crisis, featuring mission footage, cockpit recordings, and Mission Control audio from the April 1970 emergency that gripped the world.",
        archiveId: "34062Apollo13HoustonWeHaveAProblem",
        thumbnail: "https://archive.org/services/img/34062Apollo13HoustonWeHaveAProblem",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     WHERE THE RED FERN GROWS  (1974)
     Archive identifier:
       where-the-red-fern-grows-1974-faith-family-uplifting-encourage-tv
     ──────────────────────────────────────────────────────────── */
  {
    id: "where-the-red-fern-grows-1974",
    type: "movie",
    title: "Where the Red Fern Grows (1974)",
    years: "1974",
    genre: ["Drama", "Family", "Adventure"],
    rating: "G",
    score: 6.9,
    description:
      "A faithful and deeply moving adaptation of Wilson Rawls' beloved novel. Young Billy Colman saves for two years to buy a pair of coonhound pups — Old Dan and Little Ann — and trains them into champion hunting dogs in the Oklahoma Ozarks. The film tenderly traces the bond between a boy and his dogs through triumph and heartbreak, capturing the timeless themes of determination, loyalty, and growing up. Starring Stewart Petersen as Billy alongside James Whitmore and Beverly Garland, this G-rated family classic has introduced generations of viewers to one of American literature's most cherished stories.",
    thumbnail:
      "https://archive.org/services/img/where-the-red-fern-grows-1974-faith-family-uplifting-encourage-tv",
    featured: false,
    episodes: [
      {
        id: "where-the-red-fern-grows-1974-full",
        title: "Where the Red Fern Grows",
        season: 0,
        episode: 0,
        year: 1974,
        duration: "97 min",
        description:
          "Billy Colman raises and trains two beloved coonhounds, Old Dan and Little Ann, in the Oklahoma Ozarks — a story of love, loyalty, and the bittersweet passage from boyhood to maturity, based on Wilson Rawls' classic novel.",
        archiveId:
          "where-the-red-fern-grows-1974-faith-family-uplifting-encourage-tv",
        thumbnail:
          "https://archive.org/services/img/where-the-red-fern-grows-1974-faith-family-uplifting-encourage-tv",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE ADVENTURES OF HUCKLEBERRY FINN  (1939)
     Archive identifier: theadventuresofhuckleberryfinn_201611
     ──────────────────────────────────────────────────────────── */
  {
    id: "adventures-of-huckleberry-finn-1939",
    type: "movie",
    title: "The Adventures of Huckleberry Finn (1939)",
    years: "1939",
    genre: ["Adventure", "Comedy", "Drama", "Family"],
    rating: "NR",
    score: 6.8,
    description:
      "MGM's spirited adaptation of Mark Twain's beloved novel, starring Mickey Rooney as the irrepressible Huck Finn. Running away from his abusive father, Huck fakes his own death and sets off on a raft down the Mississippi River with Jim, a runaway slave seeking freedom. Together they encounter con artists, feuding families, and the full sweep of life along the antebellum South's mightiest waterway. Directed by Richard Thorpe, the film captures Twain's adventurous spirit and sharp social commentary in this classic MGM production.",
    thumbnail: "https://archive.org/services/img/theadventuresofhuckleberryfinn_201611",
    featured: false,
    episodes: [
      {
        id: "adventures-of-huckleberry-finn-1939-full",
        title: "The Adventures of Huckleberry Finn",
        season: 0,
        episode: 0,
        year: 1939,
        duration: "91 min",
        description: "Huck Finn escapes his drunken father and teams up with runaway slave Jim for a raft journey down the Mississippi, encountering adventure and danger at every bend in this classic MGM adaptation of Mark Twain's novel.",
        archiveId: "theadventuresofhuckleberryfinn_201611",
        thumbnail: "https://archive.org/services/img/theadventuresofhuckleberryfinn_201611",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     FRANKENSTEIN  (1931)
     Single feature film — archive identifier: frankenstein-1931-english
     Dir. James Whale. The definitive Universal Monster classic starring
     Boris Karloff as the Monster and Colin Clive as Dr. Frankenstein.
     ──────────────────────────────────────────────────────────── */
  {
    id: "frankenstein-1931",
    type: "movie",
    title: "Frankenstein",
    years: "1931",
    genre: ["Horror", "Sci-Fi", "Drama"],
    rating: "NR",
    score: 7.7,
    description:
      "Obsessed scientist Dr. Henry Frankenstein, aided by his hunchbacked assistant Fritz, assembles a living creature from the parts of exhumed corpses and brings it to life using the power of electricity. The Monster — portrayed by Boris Karloff in an iconic, largely wordless performance — is at first childlike and innocent, but years of mistreatment and fear transform him into something terrifying. Directed by James Whale, this seminal Universal horror film remains one of cinema's most enduring and influential classics.",
    thumbnail: "https://archive.org/services/img/frankenstein-1931-english",
    featured: false,
    episodes: [
      {
        id: "frankenstein-1931-full",
        title: "Frankenstein",
        season: 0,
        episode: 0,
        year: 1931,
        duration: "71 min",
        description:
          "Dr. Frankenstein creates life from death, only to unleash a creature the world is not ready to accept. Boris Karloff's unforgettable performance as the Monster defines this Universal horror landmark.",
        archiveId: "frankenstein-1931-english",
        thumbnail: "https://archive.org/services/img/frankenstein-1931-english",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE BRIDE OF FRANKENSTEIN  (1935)
     Single feature film — archive identifier: lp-473-pl_202403
     Dir. James Whale. Sequel to Frankenstein (1931), starring Boris Karloff
     and Elsa Lanchester in a dual role as Mary Shelley and the Bride.
     ──────────────────────────────────────────────────────────── */
  {
    id: "bride-of-frankenstein-1935",
    type: "movie",
    title: "The Bride of Frankenstein",
    years: "1935",
    genre: ["Horror", "Sci-Fi", "Drama"],
    rating: "NR",
    score: 7.8,
    description:
      "Picking up immediately where Frankenstein left off, Henry Frankenstein survives and the Monster lives on. The sinister Dr. Pretorius — a former mentor with his own grotesque experiments — coerces Frankenstein into creating a mate for the creature. The Monster, rejected everywhere he turns, briefly finds solace with a blind hermit before being driven away. When the Bride is finally brought to life and recoils from him in horror, the Monster's despair turns to devastating fury. Directed by James Whale, with Elsa Lanchester unforgettable in a dual role as Mary Shelley and the iconic, lightning-haired Bride.",
    thumbnail: "https://archive.org/services/img/lp-473-pl_202403",
    featured: false,
    episodes: [
      {
        id: "bride-of-frankenstein-1935-full",
        title: "The Bride of Frankenstein",
        season: 0,
        episode: 0,
        year: 1935,
        duration: "75 min",
        description:
          "Dr. Pretorius blackmails Frankenstein into creating a mate for the Monster, whose longing for companionship ends in tragedy. One of horror cinema's greatest sequels.",
        archiveId: "lp-473-pl_202403",
        thumbnail: "https://archive.org/services/img/lp-473-pl_202403",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     FRANKENSTEIN MEETS THE WOLF MAN  (1943)
     Single feature film — archive identifier:
       frankenstein-meets-the-wolf-man-1942
     Note: the archive identifier reflects the 1942 production/pre-release
     year; the theatrical release year and film year is 1943.
     The original monster-crossover film, uniting Universal's Wolf Man
     and Frankenstein franchises. Dir. Roy William Neill.
     ──────────────────────────────────────────────────────────── */
  {
    id: "frankenstein-meets-the-wolf-man-1943",
    type: "movie",
    title: "Frankenstein Meets the Wolf Man",
    years: "1943",
    genre: ["Horror", "Fantasy", "Sci-Fi"],
    rating: "NR",
    score: 6.4,
    description:
      "Accidentally resurrected by grave robbers, Lawrence Talbot — the Wolf Man — finds himself once again cursed with lycanthropy and desperate to die. With the help of the wise gypsy Maleva, he travels to Vasaria seeking the late Dr. Frankenstein's secrets, hoping to find a cure. Instead he discovers Frankenstein's Monster frozen in ice and becomes entangled in a dangerous experiment that could unleash both creatures at once. Cinema's first true monster-crossover event, establishing the template for the horror team-up.",
    thumbnail: "https://archive.org/services/img/frankenstein-meets-the-wolf-man-1942",
    featured: false,
    episodes: [
      {
        id: "frankenstein-meets-the-wolf-man-1943-full",
        title: "Frankenstein Meets the Wolf Man",
        season: 0,
        episode: 0,
        year: 1943,
        duration: "74 min",
        description:
          "The Wolf Man seeks a cure for his curse and instead awakens Frankenstein's Monster in this landmark Universal monster-crossover.",
        archiveId: "frankenstein-meets-the-wolf-man-1942",
        thumbnail: "https://archive.org/services/img/frankenstein-meets-the-wolf-man-1942",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE REVENGE OF FRANKENSTEIN  (1958)
     Single feature film — archive identifier: the-revenge-of-frankenstein
     Dir. Terence Fisher. Second entry in Hammer's Frankenstein series,
     starring Peter Cushing. Sequel to The Curse of Frankenstein.
     ──────────────────────────────────────────────────────────── */
  {
    id: "revenge-of-frankenstein-1958",
    type: "movie",
    title: "The Revenge of Frankenstein",
    years: "1958",
    genre: ["Horror", "Sci-Fi"],
    rating: "NR",
    score: 6.7,
    description:
      "After escaping the guillotine by having a priest executed in his place, Baron Victor Frankenstein adopts the alias Dr. Stein and establishes a thriving medical practice in Carlsbrück — using his charity work among the poor as a cover for fresh experimental material. His hunchbacked assistant Karl volunteers his own brain for transplant into a perfectly constructed body, but the procedure goes horribly wrong as Karl's new form begins to degenerate. Peter Cushing delivers a compellingly cold and charismatic performance in this polished Hammer sequel, directed by Terence Fisher.",
    thumbnail: "https://archive.org/services/img/the-revenge-of-frankenstein",
    featured: false,
    episodes: [
      {
        id: "revenge-of-frankenstein-1958-full",
        title: "The Revenge of Frankenstein",
        season: 0,
        episode: 0,
        year: 1958,
        duration: "90 min",
        description:
          "Baron Frankenstein resurfaces under a false identity and continues his brain-transplant experiments with dire consequences in this stylish Hammer horror sequel starring Peter Cushing.",
        archiveId: "the-revenge-of-frankenstein",
        thumbnail: "https://archive.org/services/img/the-revenge-of-frankenstein",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     RETURN TO OZ — 1964 RANKIN/BASS TV SPECIAL
     Animated musical TV special produced by Videocraft International
     (Rankin/Bass) and Crawley Films. Premiered on NBC, February 9, 1964
     as part of the General Electric Fantasy Hour.
     Archive identifier: LVD54513
     ──────────────────────────────────────────────────────────── */
  {
    id: "return-to-oz-1964-lvd54513",
    type: "movie",
    title: "Return to Oz (1964 Rankin/Bass TV Special)",
    years: "1964",
    genre: ["Animation", "Fantasy", "Musical", "Family", "1960s"],
    rating: "NR",
    score: 6.5,
    description:
      "An animated musical television special from Rankin/Bass (then Videocraft International), produced in association with Crawley Films and broadcast on NBC on February 9, 1964 as the first entry in the General Electric Fantasy Hour. A sequel to the studio's 1961 animated series Tales of the Wizard of Oz, the special follows Dorothy as she rediscovers her silver shoes and is swept back to Oz by a Kansas twister — only to find that the Wicked Witch of the West has returned, stripping her old friends of their cherished gifts: Socrates the Scarecrow loses his diploma, Rusty the Tin Man loses his heart, and Dandy the Lion's medal is turned into a daisy. Dorothy reunites with her companions and the Wizard to defeat the Witch once more. Scripted by Romeo Muller and directed by F. R. Crawley, Thomas Glynn, and Larry Roemer, the 51-minute special features Susan Conway as Dorothy and Larry D. Mann as both Rusty the Tin Man and the Wicked Witch — a charming Oz curiosity that marks one of Rankin/Bass's earliest forays into animated television.",
    thumbnail: "https://archive.org/services/img/LVD54513",
    featured: false,
    episodes: [
      {
        id: "return-to-oz-1964-lvd54513-full",
        title: "Return to Oz (1964)",
        season: 0,
        episode: 0,
        year: 1964,
        duration: "51 min",
        description:
          "Dorothy is carried back to Oz by a twister and must help her old friends reclaim their gifts from the returning Wicked Witch of the West in this Rankin/Bass animated NBC special.",
        archiveId: "LVD54513",
        thumbnail: "https://archive.org/services/img/LVD54513",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     JOURNEY BACK TO OZ (1972) — VHS
     Filmation animated musical feature; archive identifier:
       journey-back-to-oz-1972-vhs
     Production began in 1962 but the film wasn't released until 1972
     due to financial setbacks. Loosely based on L. Frank Baum's
     "The Marvelous Land of Oz." Stars Liza Minnelli as Dorothy,
     with a star-studded voice cast including Ethel Merman, Mickey
     Rooney, Milton Berle, Paul Lynde, and Margaret Hamilton.
     ──────────────────────────────────────────────────────────── */
  {
    id: "journey-back-to-oz-1972-vhs",
    type: "vhs",
    title: "Journey Back to Oz (1972)",
    years: "1972",
    genre: ["Animation", "Fantasy", "Musical", "Family", "1970s"],
    rating: "G",
    score: 5.7,
    description:
      "A Filmation animated musical fantasy loosely based on L. Frank Baum's \"The Marvelous Land of Oz,\" produced beginning in 1962 but delayed by financial setbacks and not released until 1972. A tornado once again carries Dorothy Gale — this time voiced by Liza Minnelli, daughter of Judy Garland — and Toto back to Oz, where the scheming witch Mombi (Ethel Merman) is raising a fearsome army of green elephants to conquer the Emerald City. Dorothy teams up with old friends the Scarecrow (Mickey Rooney), Tin Man (Danny Thomas), and Cowardly Lion (Milton Berle), as well as new companions Pumpkinhead (Paul Lynde) and the carousel horse Woodenhead, to defeat Mombi and restore peace. The film features songs by Jimmy Van Heusen with lyrics by Sammy Cahn and is notable for casting Margaret Hamilton — the original Wicked Witch of the West — as Dorothy's Aunt Em. Directed by Hal Sutherland.",
    thumbnail: "https://archive.org/services/img/journey-back-to-oz-1972-vhs",
    featured: false,
    episodes: [
      {
        id: "journey-back-to-oz-1972-vhs-full",
        title: "Journey Back to Oz (1972)",
        season: 0,
        episode: 0,
        year: 1972,
        duration: "90 min",
        description:
          "Dorothy (Liza Minnelli) returns to Oz and must stop the witch Mombi (Ethel Merman) and her army of green elephants in this star-studded Filmation animated musical.",
        archiveId: "journey-back-to-oz-1972-vhs",
        thumbnail: "https://archive.org/services/img/journey-back-to-oz-1972-vhs",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     TEEN WOLF — KDLT VHS BROADCAST  (1987)
     Single feature film recorded off-air — archive identifier:
       teen.-wolf.-kdlt.-5.4.1987deraq
     The 1985 film (dir. Rod Daniel, starring Michael J. Fox) as broadcast
     on KDLT (South Dakota) on May 4, 1987, captured on VHS with original
     commercials intact. Part of the vhsvault collection.
     ──────────────────────────────────────────────────────────── */
  {
    id: "teen-wolf-1985-kdlt-vhs",
    type: "vhs",
    title: "Teen Wolf — KDLT Broadcast (VHS, May 4, 1987)",
    years: "1987",
    genre: ["Comedy", "Fantasy", "VHS Recording"],
    rating: "PG",
    score: 6.9,
    description:
      "The quintessential 1985 teen comedy recorded off-air from KDLT (South Dakota) on May 4, 1987, preserved on VHS with original period commercials and station breaks intact. Ordinary high-schooler Scott Howard (Michael J. Fox) is struggling on a losing basketball team and pining after the most popular girl in school — until he discovers he has inherited his family's secret ability to transform into a werewolf. Embracing his inner wolf rockets Scott to overnight fame and puts him at the top of the social ladder, but he soon learns that being yourself is better than being a monster. Directed by Rod Daniel, Teen Wolf became one of the defining comedies of the decade and a box-office sensation. A genuine VHS time-capsule of mid-1980s local broadcast television.",
    thumbnail: "https://archive.org/services/img/teen.-wolf.-kdlt.-5.4.1987deraq",
    featured: false,
    episodes: [
      {
        id: "teen-wolf-1985-kdlt-vhs-full",
        title: "Teen Wolf (KDLT, May 4, 1987)",
        season: 0,
        episode: 0,
        year: 1987,
        duration: "91 min",
        description:
          "Teen Wolf (1985) as broadcast on KDLT on May 4, 1987, complete with original commercials. Michael J. Fox stars as Scott Howard, a teenager who discovers he is a werewolf and uses his powers to become the most popular kid in school.",
        archiveId: "teen.-wolf.-kdlt.-5.4.1987deraq",
        thumbnail: "https://archive.org/services/img/teen.-wolf.-kdlt.-5.4.1987deraq",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     ROSWELL REPORTS, VOLUME 1  (1997)
     Single documentary — archive identifier: gov.archives.341-roswell-1
     Official U.S. Air Force documentary produced by Capt. James MacAndrew
     as a visual companion to "The Roswell Report: Case Closed" (1997).
     A U.S. government work in the public domain.
     ──────────────────────────────────────────────────────────── */
  {
    id: "roswell-reports-vol-1-1997",
    type: "documentary",
    title: "Roswell Reports, Volume 1 (1997)",
    years: "1997",
    genre: ["Documentary", "History", "Military"],
    rating: "NR",
    score: 7.2,
    description:
      "The official United States Air Force documentary produced to accompany the 1997 publication \"The Roswell Report: Case Closed.\" Written and produced by Captain James MacAndrew and released through the National Archives and Records Administration, this film examines the famous 1947 Roswell incident — the alleged crash of an unidentified object near Roswell, New Mexico — and presents the Air Force's declassified conclusions. Drawing on official documentation, photographs, footage, and testimony, the film argues that the recovered debris originated from Project Mogul, a classified high-altitude balloon program designed to monitor Soviet nuclear activity, and that accounts of alien bodies corresponded to anthropomorphic test dummies used in later parachute experiments. A unique primary-source document of Cold War history and government transparency.",
    thumbnail: "https://archive.org/services/img/gov.archives.341-roswell-1",
    featured: false,
    episodes: [
      {
        id: "roswell-reports-vol-1-1997-full",
        title: "Roswell Reports, Volume 1",
        season: 0,
        episode: 0,
        year: 1997,
        duration: "24 min",
        description:
          "The U.S. Air Force's official documentary companion to \"The Roswell Report: Case Closed,\" presenting declassified findings on the 1947 Roswell incident through footage, photographs, and official testimony.",
        archiveId: "gov.archives.341-roswell-1",
        thumbnail: "https://archive.org/services/img/gov.archives.341-roswell-1",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     TALES FROM THE CRYPT — VHS  (HBO, 1989–1996)
     VHS recording of HBO's Tales from the Crypt anthology series.
     Archive identifier: tales-from-the-crypt-vhs
     ──────────────────────────────────────────────────────────── */
  {
    id: "tales-from-the-crypt-vhs",
    type: "vhs",
    title: "Tales from the Crypt (HBO VHS Recording)",
    years: "1989–1996",
    genre: ["Horror", "Anthology", "Dark Comedy", "VHS Recording"],
    rating: "TV-MA",
    score: 8.0,
    description:
      "A VHS recording of HBO's landmark anthology horror series Tales from the Crypt, preserved with original broadcast elements. Based on the infamous 1950s EC Comics, the series aired on HBO from 1989 to 1996 across seven seasons and 93 episodes. Each installment is introduced — and wickedly closed — by the Cryptkeeper, a cackling, pun-obsessed ghoul puppet voiced by John Kassir, who descends into his candlelit crypt to present tales of murder, greed, lust, and poetic justice. Because of HBO's uncut format, the stories pushed well beyond what network television permitted, delivering graphic horror, pitch-black comedy, and morality-play twist endings that have secured the show a devoted cult following. This VHS capture preserves episodes as they were originally broadcast, complete with HBO promos and period interstitials — an authentic time-capsule of 1990s premium cable horror.",
    thumbnail: "https://archive.org/services/img/tales-from-the-crypt-vhs",
    featured: false,
    episodes: [
      {
        id: "tales-from-the-crypt-vhs-full",
        title: "Tales from the Crypt — HBO VHS Capture",
        season: 0,
        episode: 0,
        year: 1994,
        duration: "120 min",
        description:
          "VHS recording of multiple Tales from the Crypt episodes as broadcast on HBO, with original network promos and interstitials intact.",
        archiveId: "tales-from-the-crypt-vhs",
        thumbnail: "https://archive.org/services/img/tales-from-the-crypt-vhs",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE RESCUERS  (1977)
     Single feature film — archive identifier: schoolproject2_20200406
     Walt Disney Productions animated adventure directed by Wolfgang Reitherman.
     ──────────────────────────────────────────────────────────── */
  {
    id: "the-rescuers-1977",
    type: "movie",
    title: "The Rescuers",
    years: "1977",
    genre: ["Animation", "Family", "Adventure"],
    rating: "G",
    score: 7.0,
    description:
      "When a message in a bottle is discovered by the Rescue Aid Society — an international mouse organization headquartered beneath the United Nations — brave Hungarian delegate Miss Bianca and her reluctant partner Bernard are dispatched to locate a missing orphan girl named Penny. Their investigation leads them to the treacherous Devil's Bayou, where the villainous Medusa is forcing Penny to retrieve a priceless diamond from a dangerous cave. Featuring the voices of Bob Newhart and Eva Gabor, with songs by Sammy Fain.",
    thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
    featured: false,
    episodes: [
      {
        id: "the-rescuers-1977-full",
        title: "The Rescuers",
        season: 0,
        episode: 0,
        year: 1977,
        duration: "78 min",
        description:
          "Mouse agents Miss Bianca and Bernard race to rescue orphan Penny from the clutches of the villainous Madame Medusa in the Louisiana bayou.",
        archiveId: "schoolproject2_20200406",
        archiveFile: "1977 - The Rescuers.mp4",
        thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE MANY ADVENTURES OF WINNIE THE POOH  (1977)
     Single feature film — archive identifier: schoolproject2_20200406
     Walt Disney Productions animated compilation directed by John Lounsbery & Wolfgang Reitherman.
     ──────────────────────────────────────────────────────────── */
  {
    id: "many-adventures-of-winnie-the-pooh-1977",
    type: "movie",
    title: "The Many Adventures of Winnie the Pooh",
    years: "1977",
    genre: ["Animation", "Family", "Comedy"],
    rating: "G",
    score: 7.3,
    description:
      "Deep in the Hundred Acre Wood, the lovable, honey-obsessed Winnie the Pooh and his friends — Piglet, Eeyore, Tigger, Rabbit, Owl, Kanga, and Roo — embark on a series of gentle, heartwarming adventures. This beloved compilation brings together three classic featurettes: Winnie the Pooh and the Honey Tree, Winnie the Pooh and the Blustery Day, and Winnie the Pooh and Tigger Too. Based on the classic stories by A. A. Milne, with narration by Sebastian Cabot and songs by the Sherman Brothers.",
    thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
    featured: false,
    episodes: [
      {
        id: "many-adventures-of-winnie-the-pooh-1977-full",
        title: "The Many Adventures of Winnie the Pooh",
        season: 0,
        episode: 0,
        year: 1977,
        duration: "74 min",
        description:
          "Three classic featurettes follow Pooh and friends through honey hunts, blustery days, and Tigger's bouncy misadventures in the Hundred Acre Wood.",
        archiveId: "schoolproject2_20200406",
        archiveFile: "1977 - The Many Adventures of Winnie the Pooh.mp4",
        thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     OLIVER & COMPANY  (1988)
     Single feature film — archive identifier: schoolproject2_20200406
     Walt Disney Pictures animated musical directed by George Scribner.
     ──────────────────────────────────────────────────────────── */
  {
    id: "oliver-and-company-1988",
    type: "movie",
    title: "Oliver & Company",
    years: "1988",
    genre: ["Animation", "Family", "Musical", "Adventure"],
    rating: "G",
    score: 6.7,
    description:
      "A loose Disney retelling of Charles Dickens' Oliver Twist, set on the streets of New York City. Oliver, a scrappy orphan kitten, falls in with a gang of streetwise dogs led by the smooth-talking Dodger, all working for the down-on-his-luck Fagin. When Oliver is adopted by a wealthy girl named Jenny, his two very different worlds collide — and the villainous loan shark Sykes threatens everyone he loves. Featuring an upbeat pop soundtrack with songs performed by Billy Joel, Bette Midler, and Huey Lewis.",
    thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
    featured: false,
    episodes: [
      {
        id: "oliver-and-company-1988-full",
        title: "Oliver & Company",
        season: 0,
        episode: 0,
        year: 1988,
        duration: "74 min",
        description:
          "Orphan kitten Oliver joins a gang of New York street dogs and must navigate life between his new canine family and the wealthy girl who adopts him.",
        archiveId: "schoolproject2_20200406",
        archiveFile: "1988 - Oliver & Company.mp4",
        thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     A GOOFY MOVIE  (1995)
     Single feature film — archive identifier: schoolproject2_20200406
     Walt Disney Pictures animated comedy directed by Kevin Lima.
     ──────────────────────────────────────────────────────────── */
  {
    id: "a-goofy-movie-1995",
    type: "movie",
    title: "A Goofy Movie",
    years: "1995",
    genre: ["Animation", "Family", "Comedy", "Musical"],
    rating: "G",
    score: 7.0,
    description:
      "Goofy's teenage son Max is on the verge of winning over his crush Roxanne when his well-meaning but hopelessly embarrassing dad derails his plans with a cross-country fishing vacation. As the unlikely duo careens from one mishap to the next — encountering Bigfoot along the way — Max and Goofy must find their way back to each other before the trip tears them apart for good. Featuring the voice talents of Bill Farmer and Jason Marsden, with an original soundtrack including the Powerline anthem \"I 2 I.\"",
    thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
    featured: false,
    episodes: [
      {
        id: "a-goofy-movie-1995-full",
        title: "A Goofy Movie",
        season: 0,
        episode: 0,
        year: 1995,
        duration: "78 min",
        description:
          "Goofy takes his embarrassed teenage son Max on a cross-country fishing trip, and the two navigate their strained relationship along the road.",
        archiveId: "schoolproject2_20200406",
        archiveFile: "1995 - A Goofy Movie.mp4",
        thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     WHO FRAMED ROGER RABBIT  (1988)
     Single feature film — archive identifier: schoolproject2_20200406
     Dir. Robert Zemeckis. Live-action/animation hybrid starring Bob Hoskins.
     ──────────────────────────────────────────────────────────── */
  {
    id: "who-framed-roger-rabbit-1988",
    type: "movie",
    title: "Who Framed Roger Rabbit",
    years: "1988",
    genre: ["Animation", "Comedy", "Mystery", "Family"],
    rating: "PG",
    score: 7.7,
    description:
      "In a 1947 Hollywood where animated Toons live alongside humans, hard-drinking private eye Eddie Valiant is hired to investigate a cheating scandal involving cartoon star Roger Rabbit. When the studio head is murdered and Roger is framed for the crime, Eddie reluctantly teams up with the frantic rabbit to expose the real villain: the sinister Judge Doom, who has a deadly plan to destroy the Toons' home of Toontown. A groundbreaking live-action and animation hybrid from director Robert Zemeckis and producer Steven Spielberg, featuring beloved characters from both Disney and Warner Bros. in the same frame for the first time.",
    thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
    featured: false,
    episodes: [
      {
        id: "who-framed-roger-rabbit-1988-full",
        title: "Who Framed Roger Rabbit",
        season: 0,
        episode: 0,
        year: 1988,
        duration: "104 min",
        description:
          "Private eye Eddie Valiant must clear Roger Rabbit's name and uncover the true killer behind a Hollywood murder plot targeting Toontown.",
        archiveId: "schoolproject2_20200406",
        archiveFile: "1988 - Who Framed Roger Rabbit.mp4",
        thumbnail: "https://archive.org/services/img/schoolproject2_20200406",
      },
    ],
  },
  {
    id: "mtv-saturday-night-concert-reo-speedwagon-1981",
    type: "concert",
    title: "MTV Saturday Night Concert: REO Speedwagon — Live Infidelity (1981)",
    years: "1981",
    genre: ["Music", "Concert", "Rock"],
    rating: "TV-PG",
    score: 8.5,
    description:
      "MTV's very first Saturday Night Concert, broadcast on August 8, 1981 — just one week after the network's historic launch. The program features REO Speedwagon performing their celebrated live album Hi Infidelity in full, captured at the peak of the band's commercial success. A landmark artifact of early MTV and a time-capsule of the fledgling cable music channel in its opening days, complete with original network bumpers and era-defining production.",
    thumbnail: "https://archive.org/services/img/mtv-8-8-81-first-ever-saturday-night-concert-reo-speedwagon-live-infidelity",
    featured: false,
    episodes: [
      {
        id: "mtv-1981-reo-speedwagon-full-concert",
        title: "REO Speedwagon: Live Infidelity — MTV Saturday Night Concert (August 8, 1981)",
        season: 0,
        episode: 0,
        year: 1981,
        duration: "60 min",
        description: "MTV's first-ever Saturday Night Concert special, airing August 8, 1981. REO Speedwagon performs their Hi Infidelity concert in full, one week after MTV's launch on August 1, 1981.",
        archiveId: "mtv-8-8-81-first-ever-saturday-night-concert-reo-speedwagon-live-infidelity",
        thumbnail: "https://archive.org/services/img/mtv-8-8-81-first-ever-saturday-night-concert-reo-speedwagon-live-infidelity",
      },
    ],
  },
];

const CATEGORIES = [
  { id: "featured", label: "Featured Classics" },
  { id: "drama", label: "Drama" },
  { id: "comedy", label: "Comedy" },
  { id: "sci-fi", label: "Sci-Fi & Fantasy" },
  { id: "crime", label: "Crime & Mystery" },
  { id: "family", label: "Family" },
  { id: "1970s", label: "1970s Favorites" },
  { id: "1980s", label: "1980s Hits" },
  { id: "1990s", label: "1990s Classics" },
  { id: "movies", label: "Classic Movies" },
];

function getShowsByGenre(genre) {
  return SHOWS.filter((s) => s.genre.some((g) => g.toLowerCase() === genre.toLowerCase()));
}

function getFeaturedShows() {
  return SHOWS.filter((s) => s.featured);
}

function getMovies() {
  return SHOWS.filter((s) => s.type === "movie");
}

function getShowsByDecade(decade) {
  const start = parseInt(decade);
  return SHOWS.filter((s) => {
    const startYear = parseInt(s.years.split("–")[0]);
    return startYear >= start && startYear < start + 10;
  });
}

function getShowById(id) {
  return SHOWS.find((s) => s.id === id);
}
