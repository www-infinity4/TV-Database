Warning: truncated output (original token count: 153283)
Total output lines: 12368

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
    thumbnail: "https://archive.org/services/img/due-south-1994-99",
    featured: true,
    episodes: [
      /* ── Pilot ── */
      {
        id: "ds-s00e01", title: "Pilot", season: 0, episode: 1,
        year: 1994, duration: "90 min",
        description: "Mountie Benton Fraser arrives in Chicago to investigate his father's death and ends up teaming with Det. Ray Vecchio.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/01 TV Movie (1994)/S00E01 Pilot.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      /* ── Season 1 ── */
      {
        id: "ds-s01e01", title: "Free Willie", season: 1, episode: 1,
        year: 1994, duration: "47 min",
        description: "Fraser helps free a wrongly convicted man and uncovers a corporate cover-up.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E01 Free Willie.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e02", title: "Diefenbaker's Day Off", season: 1, episode: 2,
        year: 1994, duration: "47 min",
        description: "Diefenbaker, Fraser's deaf wolf, witnesses a murder while Fraser is stuck at the Consulate.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E02 Diefenbaker's Day Off.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e03", title: "Manhunt", season: 1, episode: 3,
        year: 1994, duration: "47 min",
        description: "Fraser tracks a fugitive from his past across Chicago.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E03 Manhunt.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e04", title: "They Eat Horses, Don't They?", season: 1, episode: 4,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio investigate the theft of a prize racehorse.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E04 They Eat Horses, Don't They.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e05", title: "Pizzas and Promises", season: 1, episode: 5,
        year: 1994, duration: "47 min",
        description: "A seemingly routine pizza delivery turns into a case involving the mob.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E05 Pizzas and Promises.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e06", title: "Chinatown", season: 1, episode: 6,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio are drawn into Chicago's Chinatown to solve a kidnapping.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E06 Chinatown.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e07", title: "Chicago Holiday (Part 1)", season: 1, episode: 7,
        year: 1994, duration: "47 min",
        description: "Fraser escorts a European princess around Chicago, unaware that assassins are on her trail.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E07 Chicago Holiday (Part 1).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e08", title: "Chicago Holiday (Part 2)", season: 1, episode: 8,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio race to protect the princess from the assassins closing in on her.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E08 Chicago Holiday (Part 2).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e09", title: "A Cop, a Mountie and a Baby", season: 1, episode: 9,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio must look after an abandoned baby while solving a case.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E09 A Cop, a Mountie and a Baby.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e10", title: "The Gift of the Wheelman", season: 1, episode: 10,
        year: 1994, duration: "47 min",
        description: "A getaway driver seeks Fraser's help after becoming involved in a bank robbery.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E10 The Gift of the Wheelman.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e11", title: "You Must Remember This", season: 1, episode: 11,
        year: 1994, duration: "47 min",
        description: "A woman with amnesia holds the key to a dangerous secret.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E11 You Must Remember This.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e12", title: "A Hawk and a Handsaw", season: 1, episode: 12,
        year: 1994, duration: "47 min",
        description: "Fraser is involuntarily committed to a psychiatric hospital and must unravel a plot from within.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E12 A Hawk and a Handsaw.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e13", title: "An Eye for an Eye", season: 1, episode: 13,
        year: 1994, duration: "47 min",
        description: "Fraser investigates a case of apparent vigilante justice in a neighbourhood under siege.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E13 An Eye for an Eye.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e14", title: "The Man Who Knew Too Little", season: 1, episode: 14,
        year: 1994, duration: "47 min",
        description: "An innocent bystander witnesses a crime but doesn't realise what he saw.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E14 The Man Who Knew Too Little.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e15", title: "The Wild Bunch", season: 1, episode: 15,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio tangle with a gang of elderly bank robbers.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E15 The Wild Bunch.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e16", title: "The Blue Line", season: 1, episode: 16,
        year: 1994, duration: "47 min",
        description: "An NHL hockey player is implicated in a crime and Fraser uses his knowledge of the game to help.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E16 The Blue Line.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e17", title: "The Deal", season: 1, episode: 17,
        year: 1994, duration: "47 min",
        description: "Fraser and Vecchio must negotiate a dangerous hostage situation.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E17 The Deal.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e18", title: "An Invitation to Romance", season: 1, episode: 18,
        year: 1994, duration: "47 min",
        description: "Fraser's courtly manners attract the attention of a lonely widow hiding a dark secret.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E18 An Invitation to Romance.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e19", title: "Heaven and Earth", season: 1, episode: 19,
        year: 1995, duration: "47 min",
        description: "Fraser receives a spiritual visit and must solve a decades-old murder mystery.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E19 Heaven and Earth.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e20", title: "Victoria's Secret (Part 1)", season: 1, episode: 20,
        year: 1995, duration: "47 min",
        description: "A woman from Fraser's past resurfaces in Chicago, reopening old wounds and old cases.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E20 Victoria's Secret (Part 1).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e21", title: "Victoria's Secret (Part 2)", season: 1, episode: 21,
        year: 1995, duration: "47 min",
        description: "Fraser's loyalty is torn between his duty and the woman he once loved.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E21 Victoria's Secret (Part 2).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s01e22", title: "Letting Go", season: 1, episode: 22,
        year: 1995, duration: "47 min",
        description: "Fraser struggles to move on in the aftermath of Victoria's departure.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/02 Season 1 (1994 - 95)/S01E22 Letting Go.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      /* ── Season 2 ── */
      {
        id: "ds-s02e01", title: "North", season: 2, episode: 1,
        year: 1995, duration: "47 min",
        description: "Fraser heads north to investigate a murder in Canada's wilderness.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E01 North.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e02", title: "Vault", season: 2, episode: 2,
        year: 1995, duration: "47 min",
        description: "Fraser and Vecchio are trapped inside a bank vault during a robbery.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E02 Vault.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e03", title: "The Witness", season: 2, episode: 3,
        year: 1995, duration: "47 min",
        description: "A key witness to a mob killing needs protection and only Fraser can provide it.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E03 Witness.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e04", title: "Bird in the Hand", season: 2, episode: 4,
        year: 1995, duration: "47 min",
        description: "A political assassination plot puts Fraser and Vecchio in the crosshairs.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E04 Bird in the Hand.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e05", title: "The Promise", season: 2, episode: 5,
        year: 1995, duration: "47 min",
        description: "Fraser fulfils an old promise to a dying man, leading to unexpected danger.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E05 The Promise.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e06", title: "The Mask", season: 2, episode: 6,
        year: 1995, duration: "47 min",
        description: "A stolen Native Canadian ceremonial mask becomes the centre of an international theft ring.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E06 Mask.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e07", title: "Juliet Is Bleeding", season: 2, episode: 7,
        year: 1995, duration: "47 min",
        description: "Vecchio's sister gets involved with a mob boss, forcing the team into a dangerous operation.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E07 Juliet is Bleeding.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e08", title: "One Good Man", season: 2, episode: 8,
        year: 1995, duration: "47 min",
        description: "A politician's good intentions are exploited by those around him.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E08 One Good Man.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e09", title: "The Edge", season: 2, episode: 9,
        year: 1996, duration: "47 min",
        description: "Fraser confronts his own mortality after a near-death experience.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E09 The Edge.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e10", title: "Starman", season: 2, episode: 10,
        year: 1996, duration: "47 min",
        description: "A high-profile astronaut is targeted by saboteurs and only Fraser sees through the deception.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E10 Starman.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e11", title: "We Are the Eggmen", season: 2, episode: 11,
        year: 1996, duration: "47 min",
        description: "An unusual case involving exotic eggs leads Fraser and Vecchio into a world of rare-animal smuggling.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E11 We Are the Eggmen.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e12", title: "Some Like It Red", season: 2, episode: 12,
        year: 1996, duration: "47 min",
        description: "Fraser goes undercover in the fashion world to catch a jewel thief.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E12 Some Like It Red.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e13", title: "White Men Can't Jump to Conclusions", season: 2, episode: 13,
        year: 1996, duration: "47 min",
        description: "A basketball charity event becomes the cover for a deadly scheme.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E13 White Men Can't Jump to Conclusions.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e14", title: "All the Queen's Horses", season: 2, episode: 14,
        year: 1996, duration: "47 min",
        description: "Fraser must prevent a hijacking of a train carrying the RCMP Musical Ride horses.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E14 All the Queen's Horses.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e15", title: "Body Language", season: 2, episode: 15,
        year: 1996, duration: "47 min",
        description: "A mute street artist communicates the only way he can — through art — to expose a killer.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E15 Body Language.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e16", title: "The Duel", season: 2, episode: 16,
        year: 1996, duration: "47 min",
        description: "An honour dispute escalates into a life-or-death standoff.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E16 The Duel.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e17", title: "Red, White or Blue", season: 2, episode: 17,
        year: 1996, duration: "47 min",
        description: "A retired spy's past catches up with him — and with Fraser.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E17 Red, White or Blue.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s02e18", title: "Flashback", season: 2, episode: 18,
        year: 1996, duration: "47 min",
        description: "Fraser and Vecchio investigate a cold case using recovered memories.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/03 Season 2 (1995 - 96)/S02E18 Flashback.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      /* ── Season 3 ── */
      {
        id: "ds-s03e01", title: "Burning Down the House", season: 3, episode: 1,
        year: 1997, duration: "47 min",
        description: "In the season opener Fraser faces the aftermath of a conspiracy that shook the 27th District.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E01 Burning Down the House.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e02", title: "Eclipse", season: 3, episode: 2,
        year: 1997, duration: "47 min",
        description: "A solar eclipse coincides with a string of crimes that seem to defy explanation.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E02 Eclipse.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e03", title: "I Coulda Been a Defendant", season: 3, episode: 3,
        year: 1997, duration: "47 min",
        description: "Fraser finds himself on the wrong side of the law when he is accused of a crime.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E03 I Coulda Been A Defendant.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e04", title: "Strange Bedfellows", season: 3, episode: 4,
        year: 1997, duration: "47 min",
        description: "Political rivals must cooperate to survive — and Fraser is the unlikely mediator.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E04 Strange Bedfellows.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e05", title: "Seeing Is Believing", season: 3, episode: 5,
        year: 1997, duration: "47 min",
        description: "Witnesses to a crime all report wildly different versions of events.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E05 Seeing Is Believing.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e06", title: "Bounty Hunter", season: 3, episode: 6,
        year: 1997, duration: "47 min",
        description: "A bounty hunter and Fraser clash over the retrieval of a fugitive.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E06 Bounty Hunter.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e07", title: "Mountie & Soul", season: 3, episode: 7,
        year: 1997, duration: "47 min",
        description: "Fraser's sense of duty is tested when he must choose between regulation and justice.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E07 Mountie & Soul.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e08", title: "Spy vs. Spy", season: 3, episode: 8,
        year: 1997, duration: "47 min",
        description: "Cold War secrets surface in Chicago when rival intelligence agents converge on the city.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E08 Spy VS. Spy.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e09", title: "Asylum", season: 3, episode: 9,
        year: 1997, duration: "47 min",
        description: "A defector seeks sanctuary at the Canadian Consulate, putting Fraser in a diplomatic minefield.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E09 Asylum.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e10", title: "Perfect Strangers", season: 3, episode: 10,
        year: 1997, duration: "47 min",
        description: "Fraser and his new partner must work together despite their very different approaches.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E10 Perfect Strangers.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e11", title: "Dead Guy Running", season: 3, episode: 11,
        year: 1997, duration: "47 min",
        description: "A man believed dead turns up alive — and very much in danger.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E11 Dead Guy Running.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e12", title: "Mountie on the Bounty (Part 1)", season: 3, episode: 12,
        year: 1998, duration: "47 min",
        description: "Fraser and his partner chase a criminal onto a cargo ship bound for the open sea.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E12 Mountie on the Bounty (Part 1).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s03e13", title: "Mountie on the Bounty (Part 2)", season: 3, episode: 13,
        year: 1998, duration: "47 min",
        description: "Trapped at sea, Fraser must outwit the criminals and find a way back to shore.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/04 Season 3 (1997 - 98)/S03E13 Mountie on the Bounty (Part 2).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      /* ── Season 4 ── */
      {
        id: "ds-s04e01", title: "Dr. Longball", season: 4, episode: 1,
        year: 1998, duration: "47 min",
        description: "A celebrity doctor's charity golf tournament turns deadly.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E01 Dr. Longball.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e02", title: "Easy Money", season: 4, episode: 2,
        year: 1998, duration: "47 min",
        description: "Fraser investigates a get-rich-quick scheme that is leaving victims in its wake.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E02 Easy Money.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e03", title: "The Ladies' Man", season: 4, episode: 3,
        year: 1998, duration: "47 min",
        description: "A charming con artist is targeting wealthy women across Chicago.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E03 The Ladies' Man.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e04", title: "Mojo Rising", season: 4, episode: 4,
        year: 1998, duration: "47 min",
        description: "A blues musician's lucky charm is stolen — along with the evidence in a murder case.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E04 Mojo Rising.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e05", title: "Dead Men Don't Throw Rice", season: 4, episode: 5,
        year: 1998, duration: "47 min",
        description: "A wedding party becomes the scene of a crime when the groom is found dead.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E05 Dead Men Don't Throw Rice.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e06", title: "Odds", season: 4, episode: 6,
        year: 1998, duration: "47 min",
        description: "Illegal gambling connects a series of seemingly unrelated crimes.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E06 Odds.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e07", title: "Mountie Sings the Blues", season: 4, episode: 7,
        year: 1998, duration: "47 min",
        description: "Fraser goes undercover in the Chicago blues scene to catch a killer.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E07 Mountie Sings the Blues.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e08", title: "Good for the Soul", season: 4, episode: 8,
        year: 1998, duration: "47 min",
        description: "A priest's confession puts Fraser in an impossible ethical position.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E08 Good For the Soul.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e09", title: "A Likely Story", season: 4, episode: 9,
        year: 1998, duration: "47 min",
        description: "An improbable chain of coincidences leads Fraser to the truth in a baffling case.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E09 A Likely Story.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e10", title: "Say Amen", season: 4, episode: 10,
        year: 1998, duration: "47 min",
        description: "A revival preacher is suspected of fraud — or something far worse.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E10 Say Amen.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e11", title: "Hunting Season", season: 4, episode: 11,
        year: 1998, duration: "47 min",
        description: "A dangerous game of cat and mouse unfolds across the city.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E11 Hunting Season.mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e12", title: "Call of the Wild (Part 1)", season: 4, episode: 12,
        year: 1998, duration: "47 min",
        description: "Fraser is drawn back to Canada as a series finale adventure begins.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E12 Call of the Wild (Part 1).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
      },
      {
        id: "ds-s04e13", title: "Call of the Wild (Part 2)", season: 4, episode: 13,
        year: 1998, duration: "47 min",
        description: "Fraser's final adventure concludes, bringing his journey full circle.",
        archiveId: "due-south-1994-99", archiveFile: "Due South (1994 - 99)/05 Season 4 (1998 - 99)/S04E13 Call of the Wild (Part 2).mp4",
        thumbnail: "https://archive.org/services/img/due-south-1994-99",
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
    thumbnail: "https://archive.org/services/img/mash-complete-series_202511",
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
        archiveId: "mash-complete-series_202511",
        archiveFile: "MASH/1/01x01 Pilot.mp4",
        thumbnail: "https://archive.org/services/img/mash-complete-series_202511",
      },
      {
        id: "mash-s01e02",
        title: "To Market, To Market",
        season: 1,
        episode: 2,
        year: 1972,
        duration: "25 min",
        description: "Henry trades the camp's hydrocort for a black market still.",
        archiveId: "mash-complete-series_202511",
        archiveFile: "MASH/1/01x02 To Market, to Market.mp4",
        thumbnail: "https://archive.org/services/img/mash-complete-series_202511",
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
        archiveId: "allinfam-1",
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
        archiveId: "vhs-tape-five-episodes-of-cheers_20231216",
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
        archiveId: "star-trek-the-original-series-s-01-e-01-the-man-trap",
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
        archiveId: "vts-01-1_20220124_0030",
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
        archiveId: "Knutts",
        archiveFile: "Andy Griffith Season 1/Andy.Griffith-S01E01-New Housekeeper.mp4",
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
        archiveId: "leave-it-to-beaver-the-complete-series-1957-1963",
        archiveFile: "Leave It to Beaver (The Complete Series) [1957 - 1963]/Season 1/S01E01 - Beaver Gets 'Spelied'.mp4",
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
        archiveId: "Seinfeld.Complete.Series",
        archiveFile: "Season 1/Seinfeld.S01E01.The.Seinfeld.Chronicles.720p.WEBrip.AAC.EN-SUB.x264-[MULVAcoded].mp4",
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
        archiveId: "gilligans-island-complete-tv-series",
        archiveFile: "Season 01/Gilligans.Island.S01E01.Two.on.a.Raft.mp4",
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
        archiveId: "Frank_O",
        archiveFile: "Columbo.S01E02.1971.Murder.by.the.Book.mp4",
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
        archiveId: "september-4-1972",
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
        archiveId: "washingtoon-1985", archiveFile: "Washingtoon - Episode 5 -(1985 Showtime sitcom) - archive.mp4",
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
        archiveId: "washingtoon-1985", archiveFile: "Washingtoon - Episode 8 - RARE - 1985 Sitcom -iyoutubetomp4 yt.mp4",
        thumbnail: "https://archive.org/services/img/washingtoon-1985",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE CARE BEARS IN THE LAND WITHOUT FEELINGS  (1983)
     Single TV special — archive identifier:
       the-care-bears-in-the-land-without-feelings-1983-etc._202109
     Original VHS release containing the ~24-min special that
     introduced the Care Bears to television audiences.
     The first Care Bears production; villain is Professor Coldheart.
     ──────────────────────────────────────────────────────────── */
  {
    id: "care-bears-land-without-feelings-1983",
    type: "movie",
    title: "The Care Bears in the Land Without Feelings",
    years: "1983",
    genre: ["Animation", "Family", "Fantasy"],
    rating: "G",
    score: 6.5,
    description:
      "When a boy named Kevin runs away from home and stumbles into the clutches of the cold-hearted Professor Coldheart, the Care Bears journey to the icy Land Without Feelings to rescue him and remind everyone that caring is the most powerful force in the world. The very first Care Bears television special, introducing Tenderheart Bear and the full cast of Care Bears.",
    thumbnail: "https://archive.org/services/img/the-care-bears-in-the-land-without-feelings-1983-etc._202109",
    featured: false,
    episodes: [
      {
        id: "care-bears-land-without-feelings-1983-full",
        title: "The Care Bears in the Land Without Feelings",
        season: 0,
        episode: 0,
        year: 1983,
        duration: "24 min",
        description:
          "Professor Coldheart lures a runaway boy named Kevin to his Land Without Feelings. The Care Bears race to save Kevin and show him — and Coldheart — that caring matters.",
        archiveId: "the-care-bears-in-the-land-without-feelings-1983-etc._202109",
        thumbnail: "https://archive.org/services/img/the-care-bears-in-the-land-without-feelings-1983-etc._202109",
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
     M  (1931)
     Single feature film — archive identifier:
       fritz-langs-m-1931-restored-movie-720p-hd
     Dir. Fritz Lang. Nero-Film AG. Germany. 117 min.
     Peter Lorre's career-defining performance as Hans Beckert.
     ──────────────────────────────────────────────────────────── */
  {
    id: "fritz-lang-m-1931",
    type: "movie",
    title: "M",
    years: "1931",
    genre: ["Crime", "Thriller", "Drama"],
    rating: "Not Rated",
    score: 8.4,
    description:
      "Fritz Lang's landmark German expressionist masterpiece — and his first sound film — follows the desperate manhunt for Hans Beckert (Peter Lorre), a serial killer preying on children in a Weimar-era German city. As the police clamp down on all criminal activity in their search, the city's organised underworld — their operations paralysed by the heat — launches its own parallel investigation, ultimately putting Beckert on trial before a kangaroo court of criminals in a bombed-out factory. A devastating meditation on mob justice, psychological compulsion, and the nature of guilt. Lorre's performance — the haunting whistling of Edvard Grieg's \"In the Hall of the Mountain King\" — is one of cinema's most iconic. Restored 720p HD print.",
    thumbnail: "https://archive.org/services/img/fritz-langs-m-1931-restored-movie-720p-hd",
    featured: true,
    episodes: [
      {
        id: "fritz-lang-m-1931-full",
        title: "M",
        season: 0,
        episode: 0,
        year: 1931,
        duration: "117 min",
        description:
          "A city is gripped by terror as a child murderer strikes repeatedly. With police failing to catch him, the criminal underworld conducts its own hunt — culminating in a harrowing underground trial. Peter Lorre's breakthrough role. Restored HD print.",
        archiveId: "fritz-langs-m-1931-restored-movie-720p-hd",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/fritz-langs-m-1931-restored-movie-720p-hd",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     SCREAM OF FEAR  (1961)
     Single feature film — archive identifier: scream-of-fear
     Also released as "Taste of Fear" (UK). Dir. Seth Holt.
     Hammer Film Productions. Stars Susan Strasberg,
     Ronald Lewis, Ann Todd, Christopher Lee. 82 min.
     ──────────────────────────────────────────────────────────── */
  {
    id: "scream-of-fear-1961",
    type: "movie",
    title: "Scream of Fear",
    years: "1961",
    genre: ["Horror", "Thriller", "Mystery"],
    rating: "Not Rated",
    score: 7.7,
    description:
      "Penny Appleby (Susan Strasberg), a wheelchair-bound young woman, travels to the South of France to visit her wealthy father — only to find him absent and a strange new stepmother, Jane (Ann Todd), and her companion Dr. Gerrard (Christopher Lee) in residence. When Penny begins discovering her father's corpse in different locations around the estate, only to have it vanish without a trace each time, she wonders if she is losing her mind — or if someone is driving her to it. One of Hammer Film Productions' finest psychological thrillers, modelled on Hitchcock and boasting a genuinely shocking twist ending. Directed by Seth Holt.",
    thumbnail: "https://archive.org/services/img/scream-of-fear",
    featured: false,
    episodes: [
      {
        id: "scream-of-fear-1961-full",
        title: "Scream of Fear",
        season: 0,
        episode: 0,
        year: 1961,
        duration: "82 min",
        description:
          "A wheelchair-bound woman visiting her father's French villa keeps seeing his corpse — only for it to disappear each time. Is she being driven mad, or is something sinister afoot? Hammer's most accomplished psychological thriller.",
        archiveId: "scream-of-fear", archiveFile: "Scream of Fear.mp4",
        thumbnail: "https://archive.org/services/img/scream-of-fear",
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
     THE BERENSTAIN BEARS  (1985)
     CBS animated series produced by Nelvana. 13 episodes aired
     January–September 1985. Each half-hour episode contains two
     back-to-back story segments adapted from Stan and Jan
     Berenstain's beloved children's books.
     Archive identifier: the-berenstain-bears-1985
     archiveIndex maps to sequential episode (0-based).
     ──────────────────────────────────────────────────────────── */
  {
    id: "the-berenstain-bears-1985",
    type: "tv",
    title: "The Berenstain Bears",
    years: "1985",
    genre: ["Animation", "Family", "Comedy"],
    rating: "TV-G",
    score: 7.3,
    description:
      "Based on Stan and Jan Berenstain's bestselling children's book series, this Nelvana-produced CBS animated series follows the Bear family — Papa Bear, Mama Bear, Brother Bear, and Sister Bear — through everyday adventures in Bear Country. Each episode pairs two stories adapted directly from the beloved books, gently exploring themes of honesty, friendship, sharing, and growing up. Thirteen episodes aired on CBS in 1985.",
    thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
    featured: false,
    episodes: [
      {
        id: "bb-s01e01",
        title: "The Messy Room / Too Much TV",
        season: 1,
        episode: 1,
        year: 1985,
        duration: "30 min",
        description:
          "Mama Bear reaches her limit with the cubs' chaotic bedroom and declares that it must be cleaned — sparking a negotiation about who owns what and where it goes. Then the whole Bear family gets hooked on television and neglects everything else until Papa Bear pulls the plug.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e02",
        title: "The Sitter / In the Dark",
        season: 1,
        episode: 2,
        year: 1985,
        duration: "30 min",
        description:
          "When Mama and Papa go out for the evening, the cubs are left with a babysitter and discover that staying home without their parents is not as scary as they imagined. Then Sister Bear confesses she is afraid of the dark, and the family finds gentle ways to help her feel safe at night.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e03",
        title: "The Truth / Strangers",
        season: 1,
        episode: 3,
        year: 1985,
        duration: "30 min",
        description:
          "Brother and Sister accidentally break Mama's favorite lamp and try to cover it up — learning the hard way that telling the truth is always better than a coverup. Then Mama and Papa teach the cubs important rules about talking to strangers they do not know.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e04",
        title: "Go to School / The New Baby",
        season: 1,
        episode: 4,
        year: 1985,
        duration: "30 min",
        description:
          "Brother Bear is nervous about his very first day of school, and Mama walks him through what to expect — from making new friends to learning the rules of the classroom. Then Mama announces she is expecting a new cub, and Brother must adjust to the idea of sharing his family.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 3,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e05",
        title: "Moving Day / Visit the Dentist",
        season: 1,
        episode: 5,
        year: 1985,
        duration: "30 min",
        description:
          "When the Bear family moves to a grand new tree house, Brother and Sister worry about leaving their friends and familiar surroundings behind. Then Brother develops a toothache and both cubs must face their fears during a trip to the Bear Country dentist.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 4,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e06",
        title: "Too Much Junk Food / The Bad Habit",
        season: 1,
        episode: 6,
        year: 1985,
        duration: "30 min",
        description:
          "Papa Bear's love of junk food lands the whole family in trouble when Dr. Grizzly delivers a stern warning about healthy eating habits. Then Sister's nail-biting habit embarrasses her in public and the family rallies together to help her break it.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 5,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e07",
        title: "No Girls Allowed / The Trouble with Friends",
        season: 1,
        episode: 7,
        year: 1985,
        duration: "30 min",
        description:
          "Brother Bear and his friends build a clubhouse with a \"No Girls Allowed\" sign — until Sister challenges the rule and proves she belongs. Then Sister makes a new best friend whose bossy behavior starts causing real problems in Bear Country.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 6,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e08",
        title: "The Gimmies / Learn About Sharing",
        season: 1,
        episode: 8,
        year: 1985,
        duration: "30 min",
        description:
          "A trip to the toy store turns disastrous when the cubs demand every single thing they see — and Mama Bear has finally had enough of the \"gimmies.\" Later the cubs struggle to share their most prized possessions and discover that generosity feels better than hoarding.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 7,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e09",
        title: "The Spooky Old Tree / The Double Dare",
        season: 1,
        episode: 9,
        year: 1985,
        duration: "30 min",
        description:
          "Three brave little bears venture into the spooky old tree on a dare, discovering that courage means facing your fears one step at a time. Then Brother accepts a reckless double-dare from a classmate and learns that real bravery is knowing when to walk away.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 8,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e10",
        title: "Go to Camp / The Week at Grandma's",
        season: 1,
        episode: 10,
        year: 1985,
        duration: "30 min",
        description:
          "Brother and Sister head off to summer camp full of anxiety, only to find it is one of the best experiences of their young lives. Then Mama and Papa take a rare adults-only holiday while the cubs spend a wonderful week with Gramps and Gran.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 9,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e11",
        title: "The Homework Hassle / The In-Crowd",
        season: 1,
        episode: 11,
        year: 1985,
        duration: "30 min",
        description:
          "Brother Bear puts off his homework night after night until the pile becomes overwhelming — and Papa's well-meaning help only makes things worse. Then Sister desperately wants to fit in with the popular crowd at school, even if it means acting like someone she is not.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 10,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e12",
        title: "The Bears' Vacation / The Bear Detectives",
        season: 1,
        episode: 12,
        year: 1985,
        duration: "30 min",
        description:
          "The Bear family heads off on a seaside vacation, but Papa's stubborn refusal to follow the safety rules turns a fun trip into a series of near-disasters. Then Brother and Sister set up their own detective agency to solve a mysterious case of missing honey jars.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 11,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
      {
        id: "bb-s01e13",
        title: "The Bears' Christmas / Count Their Blessings",
        season: 1,
        episode: 13,
        year: 1985,
        duration: "30 min",
        description:
          "The cubs write an impossibly long letter to Santa Claus, and Papa attempts to show them the true spirit of giving by delivering gifts to the less fortunate bears of Bear Country. Then as the year ends, the whole family reflects on what they are truly grateful for.",
        archiveId: "the-berenstain-bears-1985",
        archiveIndex: 12,
        thumbnail: "https://archive.org/services/img/the-berenstain-bears-1985",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     LITTLE MUPPET MONSTERS  (1985)
     CBS animated/live-action hybrid series. Only 3 of 8 produced
     episodes aired (September–October 1985) before cancellation.
     Each episode featured live-action Muppet Monster wrap-arounds
     hosting animated cartoon segments.
     Archive identifier: little-muppet-monsters
     ──────────────────────────────────────────────────────────── */
  {
    id: "little-muppet-monsters",
    type: "tv",
    title: "Little Muppet Monsters",
    years: "1985",
    genre: ["Animation", "Comedy", "Family"],
    rating: "TV-G",
    score: 5.9,
    description:
      "One of the rarest entries in Muppet history, Little Muppet Monsters paired live-action puppet segments — featuring three lovable monster siblings, Tug, Molly, and Boo, who live behind a wall in the Muppet Theater — with animated cartoon inserts featuring the Muppet Babies characters. CBS canceled the series after only three of the eight produced episodes aired in the fall of 1985, making it the shortest-lived Muppet television production ever. The surviving episodes are a fascinating curio for fans of the Muppet universe.",
    thumbnail: "https://archive.org/services/img/little-muppet-monsters",
    featured: false,
    episodes: [
      {
        id: "lmm-s01e01",
        title: "Episode 1",
        season: 1,
        episode: 1,
        year: 1985,
        duration: "30 min",
        description:
          "Monster siblings Tug, Molly, and Boo introduce themselves from their home behind the wall of the Muppet Theater, hosting animated Muppet Babies cartoon segments in between their live-action puppet adventures. The premiere establishes the show's unusual hybrid format.",
        archiveId: "little-muppet-monsters",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/little-muppet-monsters",
      },
      {
        id: "lmm-s01e02",
        title: "Episode 2",
        season: 1,
        episode: 2,
        year: 1985,
        duration: "30 min",
        description:
          "Tug, Molly, and Boo continue their behind-the-scenes adventures in the Muppet Theater while introducing another round of animated Muppet Babies segments. The monsters' friendly chaos provides a warm live-action counterpoint to the animated sequences.",
        archiveId: "little-muppet-monsters",
        archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/little-muppet-monsters",
      },
      {
        id: "lmm-s01e03",
        title: "Episode 3",
        season: 1,
        episode: 3,
        year: 1985,
        duration: "30 min",
        description:
          "The third and final episode to air before CBS canceled the series. Tug, Molly, and Boo host the last of the broadcast Muppet Babies animated segments, unaware that the show would not return — making this episode a bittersweet footnote in Muppet television history.",
        archiveId: "little-muppet-monsters",
        archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/little-muppet-monsters",
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
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E00A Incident In A Small Jail.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s00e02", title: "Man from the South", season: 0, episode: 2,
        year: 1985, duration: "30 min",
        description: "A mysterious gambler wagers a young man's finger against the keys to a brand-new Cadillac on the outcome of a simple lighter bet.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E00B Man From The South.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s00e03", title: "Bang! You're Dead!", season: 0, episode: 3,
        year: 1985, duration: "30 min",
        description: "A young boy unwittingly loads a real revolver and carries it through town, sending the neighborhood into a hidden panic.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E00C Bang! You're Dead!.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s00e04", title: "An Unlocked Window", season: 0, episode: 4,
        year: 1985, duration: "30 min",
        description: "Two nurses caring for a bedridden patient on a stormy night realise a killer who targets nurses is still at large — and very close.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E00D An Unlocked Window.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      /* ── Season 1 (1985–86) ── */
      {
        id: "nahp-s01e01", title: "Revenge", season: 1, episode: 1,
        year: 1985, duration: "30 min",
        description: "A woman tells her husband she was attacked by a man — and when her husband spots the attacker in a crowd, he takes brutal revenge.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E01 Revenge.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e02", title: "Night Fever", season: 1, episode: 2,
        year: 1985, duration: "30 min",
        description: "A taxi driver's late-night fare becomes a deadly ride when he suspects his passenger of murder.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E02 Night Fever.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e03", title: "Wake Me When I'm Dead", season: 1, episode: 3,
        year: 1985, duration: "30 min",
        description: "A man fakes his own death to escape his troubles, only to find that death has its own very literal consequences.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E03 Wake Me When I'm Dead.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e04", title: "Final Escape", season: 1, episode: 4,
        year: 1985, duration: "30 min",
        description: "A prisoner hatches an elaborate scheme to escape inside a coffin — not knowing who has just been buried in it.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E04 Final Escape.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e05", title: "The Night Caller", season: 1, episode: 5,
        year: 1985, duration: "30 min",
        description: "A woman receives increasingly threatening telephone calls from a stranger who seems to know her every move.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E05 Night Caller.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e06", title: "Method Actor", season: 1, episode: 6,
        year: 1985, duration: "30 min",
        description: "An actor preparing for a role as a killer begins to blur the line between performance and reality.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E06 Method Actor.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e07", title: "The Human Interest Story", season: 1, episode: 7,
        year: 1985, duration: "30 min",
        description: "A journalist fabricates a heartwarming story that spins dangerously out of control.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E07 The Human Interest Story.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e08", title: "Breakdown", season: 1, episode: 8,
        year: 1985, duration: "30 min",
        description: "A hard-hearted businessman survives a car crash but is completely paralysed — and must convince rescuers he is still alive.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E08 Breakdown.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e09", title: "Prisoners", season: 1, episode: 9,
        year: 1985, duration: "30 min",
        description: "Two escaped convicts take refuge in a remote farmhouse, setting off a deadly standoff with its occupants.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E09 Prisoners.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e10", title: "Gigolo", season: 1, episode: 10,
        year: 1985, duration: "30 min",
        description: "A charming professional escort finds his carefully maintained double life beginning to unravel.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E10 Gigolo.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e11", title: "The Gloating Place", season: 1, episode: 11,
        year: 1985, duration: "30 min",
        description: "A murderer returns to savour his perfect crime — but his victim may not be finished with him yet.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E11 The Gloating Place.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e12", title: "The Right Kind of Medicine", season: 1, episode: 12,
        year: 1985, duration: "30 min",
        description: "A pharmacist discovers his new assistant knows far too much about a prescription he filled for a recent murder victim.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E12 The Right Kind Of Medicine.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e13", title: "Beast in View", season: 1, episode: 13,
        year: 1985, duration: "30 min",
        description: "A woman receives terrifying phone calls from someone who claims to know her darkest secret — but the caller may be closer than she thinks.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E13 Beast In View.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e14", title: "A Very Happy Ending", season: 1, episode: 14,
        year: 1985, duration: "30 min",
        description: "A seemingly perfect marriage conceals a very unhappy truth — and someone is about to reveal it.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E14 A Very Happy Ending.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e15", title: "The Canary Sedan", season: 1, episode: 15,
        year: 1985, duration: "30 min",
        description: "A woman plagued by visions of a ghostly yellow car discovers the haunting may have deadly real-world origins.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E15 The Canary Sedan.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e16", title: "Enough Rope for Two", season: 1, episode: 16,
        year: 1985, duration: "30 min",
        description: "Two small-time criminals plot a kidnapping, unaware their victim has deadly plans of his own.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E16 Enough Rope For Two.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e17", title: "The Creeper", season: 1, episode: 17,
        year: 1985, duration: "30 min",
        description: "A neighbourhood is terrorised by a strangler, and one woman's certainty about who the killer is may put her in terrible danger.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E17 The Creeper.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e18", title: "Happy Birthday", season: 1, episode: 18,
        year: 1985, duration: "30 min",
        description: "A woman's birthday celebration turns sinister when she suspects her husband is planning to make it her last.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E18 Happy Birthday.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e19", title: "The Jar", season: 1, episode: 19,
        year: 1985, duration: "30 min",
        description: "A man purchases a mysterious jar at a carnival sideshow and discovers its disturbing contents divide his community — and his sanity.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E19 The Jar.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e20", title: "Deadly Honeymoon", season: 1, episode: 20,
        year: 1985, duration: "30 min",
        description: "A newlywed couple's honeymoon turns to nightmare when the bride is attacked and her husband sets out for vengeance.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E20 Deadly Honeymoon.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e21", title: "Four O'Clock", season: 1, episode: 21,
        year: 1985, duration: "30 min",
        description: "A paranoid husband plants a bomb set to go off at four o'clock to kill his wife — then finds himself unable to stop it.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E21 Four O'Clock.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s01e22", title: "Road Hog", season: 1, episode: 22,
        year: 1985, duration: "30 min",
        description: "An aggressive driver's road-rage confrontation with a motorcycle gang escalates far beyond anyone's expectations.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 1/S01E22 Road Hog.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      /* ── Season 2 (1987) ── */
      {
        id: "nahp-s02e01", title: "The Initiation", season: 2, episode: 1,
        year: 1987, duration: "30 min",
        description: "A college pledge's hazing ritual takes a fatal turn that the fraternity desperately tries to cover up.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E01 The Initiation.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e02", title: "Conversation Over a Corpse", season: 2, episode: 2,
        year: 1987, duration: "30 min",
        description: "Two neighbours chat about their petty grievances while one of them is concealing a very inconvenient body.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E02 Conversation Over A Corpse.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e03", title: "Man on the Edge", season: 2, episode: 3,
        year: 1987, duration: "30 min",
        description: "A man teetering on a building ledge holds a city transfixed — and holds secrets that the police need to uncover fast.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E03 Man On The Edge.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e04", title: "If the Shoe Fits", season: 2, episode: 4,
        year: 1987, duration: "30 min",
        description: "A Cinderella story with a dark twist, where the wrong person ends up wearing the glass slipper.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E04 If The Shoe Fits.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e05", title: "The Mole", season: 2, episode: 5,
        year: 1987, duration: "30 min",
        description: "An intelligence agency hunts for a leak in its ranks, with suspicion falling on the last person anyone would suspect.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E05 The Mole.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e06", title: "Anniversary Gift", season: 2, episode: 6,
        year: 1987, duration: "30 min",
        description: "A husband's anniversary surprise for his wife turns into something neither of them could have anticipated.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E06 Anniversary Gift.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e07", title: "The Impatient Patient", season: 2, episode: 7,
        year: 1987, duration: "30 min",
        description: "A hospital patient's desperate demand to be discharged puts both his life and his doctor's career in jeopardy.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E07 The Impatient Patient.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e08", title: "When This Man Dies", season: 2, episode: 8,
        year: 1987, duration: "30 min",
        description: "A small-town man receives a series of cryptic notes warning that someone will die each time he ignores them.",
        archiveId: "the-new-alfred-hitchcock-presents-complete", archiveFile: "The New Alfred Hitchcock Presents (1985)/Season 2/S02E08 When This Man Dies.mp4",
        thumbnail: "https://archive.org/services/img/the-new-alfred-hitchcock-presents-complete",
      },
      {
        id: "nahp-s02e09", title: "The Specialty of the House", season: 2, episode: 9,
        year: 1987, duration: "30 min",
        description: "The members of an exclusive restaurant club discover too late that the specialty of the house is more special than they imagined.",
        arch…103283 tokens truncated…-as-art.",
    thumbnail: "https://img.youtube.com/vi/LKYPYj2XX80/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "daft-punk-around-world-1997-video",
        title: "Daft Punk - Around the World (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1997,
        duration: "4 min",
        description: "Michel Gondry's perfectly choreographed troupe of robots, mummies, and skeletons is a masterpiece of repetition-as-art.",
        youtubeId: "LKYPYj2XX80",
        thumbnail: "https://img.youtube.com/vi/LKYPYj2XX80/hqdefault.jpg",
      },
    ],
  },
  {
    id: "foo-fighters-everlong-1997",
    type: "music-video",
    title: "Foo Fighters - Everlong",
    years: "1997",
    genre: ["Music Video", "Alternative Rock"],
    rating: "TV-PG",
    score: 9.4,
    description: "Michel Gondry's surreal dream-logic video perfectly complements what many consider Dave Grohl's masterpiece.",
    thumbnail: "https://img.youtube.com/vi/eBG7P-K-r1Y/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "foo-fighters-everlong-1997-video",
        title: "Foo Fighters - Everlong (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1997,
        duration: "4 min",
        description: "Michel Gondry's surreal dream-logic video perfectly complements what many consider Dave Grohl's masterpiece.",
        youtubeId: "eBG7P-K-r1Y",
        thumbnail: "https://img.youtube.com/vi/eBG7P-K-r1Y/hqdefault.jpg",
      },
    ],
  },
  {
    id: "green-day-good-riddance-1997",
    type: "music-video",
    title: "Green Day - Good Riddance (Time of Your Life)",
    years: "1997",
    genre: ["Music Video", "Punk Rock"],
    rating: "TV-PG",
    score: 8.9,
    description: "A beautiful acoustic farewell used in the final episode of Seinfeld. Green Day strip away the punk energy for pure emotional honesty.",
    thumbnail: "https://img.youtube.com/vi/CnQ8N1KacJc/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "green-day-good-riddance-1997-video",
        title: "Green Day - Good Riddance (Time of Your Life) (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1997,
        duration: "3 min",
        description: "A beautiful acoustic farewell used in the final episode of Seinfeld. Green Day strip away the punk energy for pure emotional honesty.",
        youtubeId: "CnQ8N1KacJc",
        thumbnail: "https://img.youtube.com/vi/CnQ8N1KacJc/hqdefault.jpg",
      },
    ],
  },
  {
    id: "missy-elliott-the-rain-1997",
    type: "music-video",
    title: "Missy Elliott - The Rain (Supa Dupa Fly)",
    years: "1997",
    genre: ["Music Video", "Hip-Hop"],
    rating: "TV-PG",
    score: 9.1,
    description: "Hype Williams's fish-eye lens and Missy's inflatable trash-bag suit created an instantly iconic visual language for hip-hop.",
    thumbnail: "https://img.youtube.com/vi/hHcyJPTTn9w/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "missy-elliott-the-rain-1997-video",
        title: "Missy Elliott - The Rain (Supa Dupa Fly) (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1997,
        duration: "4 min",
        description: "Hype Williams's fish-eye lens and Missy's inflatable trash-bag suit created an instantly iconic visual language for hip-hop.",
        youtubeId: "hHcyJPTTn9w",
        thumbnail: "https://img.youtube.com/vi/hHcyJPTTn9w/hqdefault.jpg",
      },
    ],
  },
  {
    id: "puff-daddy-missing-you-1997",
    type: "music-video",
    title: "Puff Daddy and Faith Evans - I'll Be Missing You",
    years: "1997",
    genre: ["Music Video", "Hip-Hop"],
    rating: "TV-PG",
    score: 8.8,
    description: "Puff Daddy's heartfelt tribute to the Notorious B.I.G. spent 11 weeks at No. 1.",
    thumbnail: "https://img.youtube.com/vi/NKMtZm2YuBE/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "puff-daddy-missing-you-1997-video",
        title: "Puff Daddy and Faith Evans - I'll Be Missing You (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1997,
        duration: "5 min",
        description: "Puff Daddy's heartfelt tribute to the Notorious B.I.G. spent 11 weeks at No. 1.",
        youtubeId: "NKMtZm2YuBE",
        thumbnail: "https://img.youtube.com/vi/NKMtZm2YuBE/hqdefault.jpg",
      },
    ],
  },
  {
    id: "britney-baby-one-more-time-1998",
    type: "music-video",
    title: "Britney Spears - Baby One More Time",
    years: "1998",
    genre: ["Music Video", "Pop"],
    rating: "TV-PG",
    score: 9.0,
    description: "Nigel Dick's schoolgirl-uniform concept made Britney Spears a global phenomenon overnight.",
    thumbnail: "https://img.youtube.com/vi/C-u5WLJ9Yk4/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "britney-baby-one-more-time-1998-video",
        title: "Britney Spears - Baby One More Time (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1998,
        duration: "4 min",
        description: "Nigel Dick's schoolgirl-uniform concept made Britney Spears a global phenomenon overnight.",
        youtubeId: "C-u5WLJ9Yk4",
        thumbnail: "https://img.youtube.com/vi/C-u5WLJ9Yk4/hqdefault.jpg",
      },
    ],
  },
  {
    id: "jayz-hard-knock-life-1998",
    type: "music-video",
    title: "Jay-Z - Hard Knock Life (Ghetto Anthem)",
    years: "1998",
    genre: ["Music Video", "Hip-Hop"],
    rating: "TV-PG",
    score: 8.9,
    description: "Jay-Z samples Annie's Hard Knock Life in his commercial breakthrough, pairing the unlikely sample with street poetry.",
    thumbnail: "https://img.youtube.com/vi/3qbqIsXJLcI/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "jayz-hard-knock-life-1998-video",
        title: "Jay-Z - Hard Knock Life (Ghetto Anthem) (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1998,
        duration: "4 min",
        description: "Jay-Z samples Annie's Hard Knock Life in his commercial breakthrough, pairing the unlikely sample with street poetry.",
        youtubeId: "3qbqIsXJLcI",
        thumbnail: "https://img.youtube.com/vi/3qbqIsXJLcI/hqdefault.jpg",
      },
    ],
  },
  {
    id: "backstreet-boys-i-want-it-1999",
    type: "music-video",
    title: "Backstreet Boys - I Want It That Way",
    years: "1999",
    genre: ["Music Video", "Pop"],
    rating: "TV-PG",
    score: 8.6,
    description: "Shot at Los Angeles International Airport, arguably the most perfect boy-band pop single ever made.",
    thumbnail: "https://img.youtube.com/vi/4fndeDfaWCg/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "backstreet-boys-i-want-it-1999-video",
        title: "Backstreet Boys - I Want It That Way (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1999,
        duration: "3 min",
        description: "Shot at Los Angeles International Airport, arguably the most perfect boy-band pop single ever made.",
        youtubeId: "4fndeDfaWCg",
        thumbnail: "https://img.youtube.com/vi/4fndeDfaWCg/hqdefault.jpg",
      },
    ],
  },
  {
    id: "destinys-child-say-my-name-1999",
    type: "music-video",
    title: "Destiny's Child - Say My Name",
    years: "1999",
    genre: ["Music Video", "R&B"],
    rating: "TV-PG",
    score: 8.9,
    description: "Hype Williams directs this sleek R&B confrontation video that won two Grammy Awards for Destiny's Child.",
    thumbnail: "https://img.youtube.com/vi/sQgd6MccwZc/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "destinys-child-say-my-name-1999-video",
        title: "Destiny's Child - Say My Name (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1999,
        duration: "4 min",
        description: "Hype Williams directs this sleek R&B confrontation video that won two Grammy Awards for Destiny's Child.",
        youtubeId: "sQgd6MccwZc",
        thumbnail: "https://img.youtube.com/vi/sQgd6MccwZc/hqdefault.jpg",
      },
    ],
  },
  {
    id: "eminem-my-name-is-1999",
    type: "music-video",
    title: "Eminem - My Name Is",
    years: "1999",
    genre: ["Music Video", "Hip-Hop"],
    rating: "TV-PG",
    score: 9.0,
    description: "Dr. Dre produced Eminem's debut single, a rapid-fire comedic attack that introduced the world's most technically gifted rapper.",
    thumbnail: "https://img.youtube.com/vi/sNPnbI1arSE/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "eminem-my-name-is-1999-video",
        title: "Eminem - My Name Is (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1999,
        duration: "4 min",
        description: "Dr. Dre produced Eminem's debut single, a rapid-fire comedic attack that introduced the world's most technically gifted rapper.",
        youtubeId: "sNPnbI1arSE",
        thumbnail: "https://img.youtube.com/vi/sNPnbI1arSE/hqdefault.jpg",
      },
    ],
  },
  {
    id: "ricky-martin-livin-la-vida-loca-1999",
    type: "music-video",
    title: "Ricky Martin - Livin' la Vida Loca",
    years: "1999",
    genre: ["Music Video", "Latin Pop"],
    rating: "TV-PG",
    score: 8.6,
    description: "The Latin pop explosion arrives at full force as Ricky Martin became the first Latin artist to cross over to mainstream US pop success.",
    thumbnail: "https://img.youtube.com/vi/p47fEXGabaY/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "ricky-martin-livin-la-vida-loca-1999-video",
        title: "Ricky Martin - Livin' la Vida Loca (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1999,
        duration: "4 min",
        description: "The Latin pop explosion arrives at full force as Ricky Martin became the first Latin artist to cross over to mainstream US pop success.",
        youtubeId: "p47fEXGabaY",
        thumbnail: "https://img.youtube.com/vi/p47fEXGabaY/hqdefault.jpg",
      },
    ],
  },
  {
    id: "tlc-no-scrubs-1999",
    type: "music-video",
    title: "TLC - No Scrubs",
    years: "1999",
    genre: ["Music Video", "R&B"],
    rating: "TV-PG",
    score: 8.9,
    description: "A futuristic critique of deadbeat men that spent four weeks at No. 1 and won the Grammy for Best R&B Song.",
    thumbnail: "https://img.youtube.com/vi/FrLequ6dUdM/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "tlc-no-scrubs-1999-video",
        title: "TLC - No Scrubs (Official Music Video)",
        season: 0,
        episode: 0,
        year: 1999,
        duration: "4 min",
        description: "A futuristic critique of deadbeat men that spent four weeks at No. 1 and won the Grammy for Best R&B Song.",
        youtubeId: "FrLequ6dUdM",
        thumbnail: "https://img.youtube.com/vi/FrLequ6dUdM/hqdefault.jpg",
      },
    ],
  },
  {
    id: "fatboy-slim-weapon-of-choice-2000",
    type: "music-video",
    title: "Fatboy Slim - Weapon of Choice",
    years: "2000",
    genre: ["Music Video", "Electronic"],
    rating: "TV-PG",
    score: 9.5,
    description: "Spike Jonze filmed Christopher Walken dancing alone in an empty hotel: the most joyful 4 minutes of cinema disguised as a music video.",
    thumbnail: "https://img.youtube.com/vi/wCDIYvFmgW8/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "fatboy-slim-weapon-of-choice-2000-video",
        title: "Fatboy Slim - Weapon of Choice (Official Music Video)",
        season: 0,
        episode: 0,
        year: 2000,
        duration: "4 min",
        description: "Spike Jonze filmed Christopher Walken dancing alone in an empty hotel: the most joyful 4 minutes of cinema disguised as a music video.",
        youtubeId: "wCDIYvFmgW8",
        thumbnail: "https://img.youtube.com/vi/wCDIYvFmgW8/hqdefault.jpg",
      },
    ],
  },
  /* ================================================================
     BATCH 3 — SCIENCE / CHEMISTRY / PHYSICS YOUTUBE CHANNELS
     ================================================================ */
  {
    id: "nilered-making-aerogel",
    type: "documentary",
    title: "NileRed - Making Aerogel",
    years: "2019",
    genre: ["Science", "Chemistry", "Documentary"],
    rating: "TV-G",
    score: 9.2,
    description: "NileRed's most-watched video: a meticulous multi-day synthesis of silica aerogel, one of the lightest solids on Earth, filmed in stunning detail.",
    thumbnail: "https://img.youtube.com/vi/Y0HfmYBlF8g/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "nilered-making-aerogel-video",
        title: "NileRed - Making Aerogel",
        season: 0,
        episode: 0,
        year: 2019,
        duration: "28 min",
        description: "NileRed's most-watched video: a meticulous multi-day synthesis of silica aerogel, one of the lightest solids on Earth, filmed in stunning detail.",
        youtubeId: "Y0HfmYBlF8g",
        thumbnail: "https://img.youtube.com/vi/Y0HfmYBlF8g/hqdefault.jpg",
      },
    ],
  },
  {
    id: "nilered-plastic-to-grape-soda",
    type: "documentary",
    title: "NileRed - Turning Plastic Gloves into Grape Soda",
    years: "2021",
    genre: ["Science", "Chemistry", "Documentary"],
    rating: "TV-G",
    score: 9.0,
    description: "Starting with nothing but nitrile gloves, NileRed walks through organic chemistry transformations to produce the artificial grape flavoring in grape soda.",
    thumbnail: "https://img.youtube.com/vi/2iDSt-d3Htk/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "nilered-plastic-to-grape-soda-video",
        title: "NileRed - Turning Plastic Gloves into Grape Soda",
        season: 0,
        episode: 0,
        year: 2021,
        duration: "35 min",
        description: "Starting with nothing but nitrile gloves, NileRed walks through organic chemistry transformations to produce the artificial grape flavoring in grape soda.",
        youtubeId: "2iDSt-d3Htk",
        thumbnail: "https://img.youtube.com/vi/2iDSt-d3Htk/hqdefault.jpg",
      },
    ],
  },
  {
    id: "periodic-videos-sodium",
    type: "documentary",
    title: "Periodic Videos - Sodium",
    years: "2008",
    genre: ["Science", "Chemistry", "Education"],
    rating: "TV-G",
    score: 9.1,
    description: "Professor Sir Martyn Poliakoff drops sodium metal into water, producing a spectacular exothermic reaction. Part of the landmark periodic table series.",
    thumbnail: "https://img.youtube.com/vi/U5tCniYiKpA/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "periodic-videos-sodium-video",
        title: "Periodic Videos - Sodium",
        season: 0,
        episode: 0,
        year: 2008,
        duration: "5 min",
        description: "Professor Sir Martyn Poliakoff drops sodium metal into water, producing a spectacular exothermic reaction. Part of the landmark periodic table series.",
        youtubeId: "U5tCniYiKpA",
        thumbnail: "https://img.youtube.com/vi/U5tCniYiKpA/hqdefault.jpg",
      },
    ],
  },
  {
    id: "explosionsandfire-white-phosphorus",
    type: "documentary",
    title: "Explosions and Fire - White Phosphorus",
    years: "2019",
    genre: ["Science", "Chemistry", "Documentary"],
    rating: "TV-G",
    score: 9.0,
    description: "A deep-dive into one of chemistry's most dramatic and dangerous elements: white phosphorus spontaneously ignites in air.",
    thumbnail: "https://img.youtube.com/vi/cy7BcgRpn1g/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "explosionsandfire-white-phosphorus-video",
        title: "Explosions and Fire - White Phosphorus",
        season: 0,
        episode: 0,
        year: 2019,
        duration: "12 min",
        description: "A deep-dive into one of chemistry's most dramatic and dangerous elements: white phosphorus spontaneously ignites in air.",
        youtubeId: "cy7BcgRpn1g",
        thumbnail: "https://img.youtube.com/vi/cy7BcgRpn1g/hqdefault.jpg",
      },
    ],
  },
  {
    id: "science-max-water-car",
    type: "documentary",
    title: "Science Max - Water Car",
    years: "2015",
    genre: ["Science", "Physics", "Education", "Family"],
    rating: "TV-G",
    score: 8.7,
    description: "Host Phil McCordic scales up the water-rocket car experiment to 500 litres and builds a pressurized vehicle, also flying on jets of water.",
    thumbnail: "https://img.youtube.com/vi/3S2QNpVju1s/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "science-max-water-car-video",
        title: "Science Max - Water Car",
        season: 0,
        episode: 0,
        year: 2015,
        duration: "22 min",
        description: "Host Phil McCordic scales up the water-rocket car experiment to 500 litres and builds a pressurized vehicle, also flying on jets of water.",
        youtubeId: "3S2QNpVju1s",
        thumbnail: "https://img.youtube.com/vi/3S2QNpVju1s/hqdefault.jpg",
      },
    ],
  },
  {
    id: "veritasium-quantum-entanglement",
    type: "documentary",
    title: "Veritasium - Quantum Entanglement and Spooky Action at a Distance",
    years: "2015",
    genre: ["Science", "Physics", "Documentary", "Education"],
    rating: "TV-G",
    score: 9.3,
    description: "Derek Muller breaks down how we know quantum entanglement is real and whether it allows faster-than-light communication.",
    thumbnail: "https://img.youtube.com/vi/6OGrpOB9lgk/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "veritasium-quantum-entanglement-video",
        title: "Veritasium - Quantum Entanglement and Spooky Action at a Distance",
        season: 0,
        episode: 0,
        year: 2015,
        duration: "8 min",
        description: "Derek Muller breaks down how we know quantum entanglement is real and whether it allows faster-than-light communication.",
        youtubeId: "6OGrpOB9lgk",
        thumbnail: "https://img.youtube.com/vi/6OGrpOB9lgk/hqdefault.jpg",
      },
    ],
  },
  {
    id: "veritasium-how-planes-fly",
    type: "documentary",
    title: "Veritasium - What Everyone Gets Wrong About Planes",
    years: "2025",
    genre: ["Science", "Physics", "Documentary", "Education"],
    rating: "TV-G",
    score: 9.1,
    description: "Derek Muller dismantles bad textbook explanations of lift and explains what really keeps a 400-ton aircraft airborne.",
    thumbnail: "https://img.youtube.com/vi/vjDYfvPW4mA/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "veritasium-how-planes-fly-video",
        title: "Veritasium - What Everyone Gets Wrong About Planes",
        season: 0,
        episode: 0,
        year: 2025,
        duration: "22 min",
        description: "Derek Muller dismantles bad textbook explanations of lift and explains what really keeps a 400-ton aircraft airborne.",
        youtubeId: "vjDYfvPW4mA",
        thumbnail: "https://img.youtube.com/vi/vjDYfvPW4mA/hqdefault.jpg",
      },
    ],
  },
  {
    id: "action-lab-oobleck-hydraulic",
    type: "documentary",
    title: "The Action Lab - Oobleck Crushed by Hydraulic Press",
    years: "2019",
    genre: ["Science", "Physics", "Education"],
    rating: "TV-G",
    score: 8.8,
    description: "A bottle of oobleck meets a hydraulic press, demonstrating non-Newtonian fluid behavior: solidifying under pressure then flowing freely.",
    thumbnail: "https://img.youtube.com/vi/G1Op_1yG6lQ/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "action-lab-oobleck-hydraulic-video",
        title: "The Action Lab - Oobleck Crushed by Hydraulic Press",
        season: 0,
        episode: 0,
        year: 2019,
        duration: "7 min",
        description: "A bottle of oobleck meets a hydraulic press, demonstrating non-Newtonian fluid behavior: solidifying under pressure then flowing freely.",
        youtubeId: "G1Op_1yG6lQ",
        thumbnail: "https://img.youtube.com/vi/G1Op_1yG6lQ/hqdefault.jpg",
      },
    ],
  },
  {
    id: "mark-rober-elephant-toothpaste",
    type: "documentary",
    title: "Mark Rober - World's Largest Elephant Toothpaste Experiment",
    years: "2020",
    genre: ["Science", "Chemistry", "Education", "Family"],
    rating: "TV-G",
    score: 9.2,
    description: "Former NASA engineer Mark Rober catalyzes a massive decomposition of hydrogen peroxide, producing a geyser of foam many metres tall.",
    thumbnail: "https://img.youtube.com/vi/Kou7ur5xt_4/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "mark-rober-elephant-toothpaste-video",
        title: "Mark Rober - World's Largest Elephant Toothpaste Experiment",
        season: 0,
        episode: 0,
        year: 2020,
        duration: "12 min",
        description: "Former NASA engineer Mark Rober catalyzes a massive decomposition of hydrogen peroxide, producing a geyser of foam many metres tall.",
        youtubeId: "Kou7ur5xt_4",
        thumbnail: "https://img.youtube.com/vi/Kou7ur5xt_4/hqdefault.jpg",
      },
    ],
  },
  {
    id: "physicsfun-science-toys",
    type: "documentary",
    title: "PhysicsFun - Amazing Science Toys and Gadgets",
    years: "2020",
    genre: ["Science", "Physics", "Education"],
    rating: "TV-G",
    score: 8.8,
    description: "A dazzling collection of physical toys and optical illusions including ferrofluids, superconducting levitation, tensegrity structures, and geometric puzzles.",
    thumbnail: "https://img.youtube.com/vi/a3uxfgOc7UQ/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "physicsfun-science-toys-video",
        title: "PhysicsFun - Amazing Science Toys and Gadgets",
        season: 0,
        episode: 0,
        year: 2020,
        duration: "10 min",
        description: "A dazzling collection of physical toys and optical illusions including ferrofluids, superconducting levitation, tensegrity structures, and geometric puzzles.",
        youtubeId: "a3uxfgOc7UQ",
        thumbnail: "https://img.youtube.com/vi/a3uxfgOc7UQ/hqdefault.jpg",
      },
    ],
  },
  {
    id: "nilered-copper-sulfate-crystals",
    type: "documentary",
    title: "NileRed - Growing Giant Copper Sulfate Crystals",
    years: "2020",
    genre: ["Science", "Chemistry", "Documentary"],
    rating: "TV-G",
    score: 8.9,
    description: "NileRed grows large, vivid blue copper sulfate crystals from a saturated solution, documenting the slow crystallisation process in time-lapse.",
    thumbnail: "https://img.youtube.com/vi/7t2na4p8E0s/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "nilered-copper-sulfate-crystals-video",
        title: "NileRed - Growing Giant Copper Sulfate Crystals",
        season: 0,
        episode: 0,
        year: 2020,
        duration: "18 min",
        description: "NileRed grows large, vivid blue copper sulfate crystals from a saturated solution, documenting the slow crystallisation process in time-lapse.",
        youtubeId: "7t2na4p8E0s",
        thumbnail: "https://img.youtube.com/vi/7t2na4p8E0s/hqdefault.jpg",
      },
    ],
  },
  {
    id: "styropyro-laser-weapons",
    type: "documentary",
    title: "styropyro - Making the World's Most Powerful Laser Rifle",
    years: "2020",
    genre: ["Science", "Physics", "Education"],
    rating: "TV-G",
    score: 8.7,
    description: "A high-voltage electronics engineer builds an extremely powerful laser device and tests it on various materials in a series of dramatic demonstrations.",
    thumbnail: "https://img.youtube.com/vi/5qNFnvWWkyg/hqdefault.jpg",
    featured: false,
    episodes: [
      {
        id: "styropyro-laser-weapons-video",
        title: "styropyro - Making the World's Most Powerful Laser Rifle",
        season: 0,
        episode: 0,
        year: 2020,
        duration: "15 min",
        description: "A high-voltage electronics engineer builds an extremely powerful laser device and tests it on various materials in a series of dramatic demonstrations.",
        youtubeId: "5qNFnvWWkyg",
        thumbnail: "https://img.youtube.com/vi/5qNFnvWWkyg/hqdefault.jpg",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     LITTLE BIG MAN  (1970)
     Archive identifier: little-big-man-1970_202511
     ──────────────────────────────────────────────────────────── */
  {
    id: "little-big-man-1970",
    type: "movie",
    title: "Little Big Man (1970)",
    years: "1970",
    genre: ["Western", "Drama", "Adventure"],
    rating: "PG",
    score: 7.8,
    description:
      "Arthur Penn's sweeping revisionist Western follows 121-year-old Jack Crabb (Dustin Hoffman) as he recounts his extraordinary life — raised by Cheyenne, scout for General Custer, and the sole white survivor of the Battle of Little Bighorn. One of the first Hollywood films to portray Native Americans with dignity, it blends dark comedy, adventure, and tragedy into a landmark portrait of the American frontier.",
    thumbnail: "https://archive.org/services/img/little-big-man-1970_202511",
    featured: false,
    episodes: [
      {
        id: "little-big-man-1970-full",
        title: "Little Big Man",
        season: 0,
        episode: 0,
        year: 1970,
        duration: "139 min",
        description:
          "Dustin Hoffman stars as Jack Crabb, a 121-year-old man who recounts a life spent between two worlds — raised by Cheyenne and shaped by the violent clash of cultures on the American frontier, culminating at the Battle of Little Bighorn.",
        archiveId: "little-big-man-1970_202511",
        thumbnail: "https://archive.org/services/img/little-big-man-1970_202511",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     HOUSE OF DARK SHADOWS  (1970)
     Archive identifier: house-of-dark-shadows-1970
     Feature-film spin-off of the Dark Shadows television series.
     ──────────────────────────────────────────────────────────── */
  {
    id: "house-of-dark-shadows-1970",
    type: "movie",
    title: "House of Dark Shadows (1970)",
    years: "1970",
    genre: ["Horror", "Drama", "Mystery"],
    rating: "PG",
    score: 6.9,
    description:
      "Dan Curtis's gothic horror feature spins the cult television soap Dark Shadows into a standalone vampire tragedy. After being accidentally released from his coffin at Collinwood, Barnabas Collins resumes his predatory hunt while becoming obsessed with Maggie Evans, believing she is the reincarnation of his lost love Josette. A moody blend of romance, bloodlust, and family doom, the film condenses the series' supernatural melodrama into a macabre big-screen chiller.",
    thumbnail: "https://archive.org/services/img/house-of-dark-shadows-1970",
    featured: false,
    episodes: [
      {
        id: "house-of-dark-shadows-1970-full",
        title: "House of Dark Shadows",
        season: 0,
        episode: 0,
        year: 1970,
        duration: "97 min",
        description:
          "Barnabas Collins escapes his long imprisonment and terrorizes his descendants while seeking a cure for vampirism in this 1970 Dark Shadows feature-film spin-off.",
        archiveId: "house-of-dark-shadows-1970", archiveFile: "House of Dark Shadows (1970).mp4",
        thumbnail: "https://archive.org/services/img/house-of-dark-shadows-1970",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     LET IT BE  (1970)
     Archive identifier: Let_It_Be_1970_film
     Documentary chronicling The Beatles' final album sessions.
     ──────────────────────────────────────────────────────────── */
  {
    id: "let-it-be-1970",
    type: "documentary",
    title: "Let It Be (1970)",
    years: "1970",
    genre: ["Music", "Documentary", "Rock"],
    rating: "G",
    score: 8.1,
    description:
      "Michael Lindsay-Hogg's intimate documentary follows The Beatles through the January 1969 rehearsals and recording sessions that produced Let It Be, capturing both flashes of creative brilliance and the interpersonal strain of a band nearing its end. Shot in a loose fly-on-the-wall style, it culminates in the group's famous unannounced rooftop performance at Apple Corps — their final public concert together and one of the defining moments in rock-film history.",
    thumbnail: "https://archive.org/services/img/Let_It_Be_1970_film",
    featured: false,
    episodes: [
      {
        id: "let-it-be-1970-full",
        title: "Let It Be",
        season: 0,
        episode: 0,
        year: 1970,
        duration: "81 min",
        description:
          "The Beatles rehearse, record, argue, and finally take the roof at Apple Corps in this candid documentary of the sessions behind Let It Be.",
        archiveId: "Let_It_Be_1970_film",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/Let_It_Be_1970_film",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     VHS RECORDING 91 TAPE 1  (1990–1991)
     Archive identifier: VHSRecording91Tape1
     Off-air/cable compilation including a Knots Landing episode.
     ──────────────────────────────────────────────────────────── */
  {
    id: "vhs-recording-91-tape-1",
    type: "vhs",
    title: "VHS Tape — Prime Target, A Chorus Line & Knots Landing (1990–1991)",
    years: "1990–1991",
    genre: ["Drama", "Music", "Soap Opera", "VHS Recording"],
    rating: "TV-PG",
    score: 7.8,
    description:
      "A five-hour EP-mode home VHS compilation recorded around the 1990–1991 new year from Miami-area television sources. The tape preserves the made-for-TV action thriller Prime Target from WTVJ/NBC, the film adaptation of A Chorus Line from HBO, and the Knots Landing episode \"The Unknown\" from WCIX/CBS, making it both a broad snapshot of turn-of-the-decade television viewing and the soap-opera-related item you first pointed out.",
    thumbnail: "https://archive.org/services/img/VHSRecording91Tape1",
    featured: false,
    episodes: [
      {
        id: "vhs-recording-91-tape-1-full",
        title: "Full Tape — Prime Target, A Chorus Line & Knots Landing",
        season: 0,
        episode: 0,
        year: 1991,
        duration: "300 min",
        description:
          "Late-1990/early-1991 VHS compilation featuring Prime Target, A Chorus Line, and Knots Landing: \"The Unknown,\" captured from Miami-area broadcasts and cable feeds.",
        archiveId: "VHSRecording91Tape1",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/VHSRecording91Tape1",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     KELO VHS TAPE  (1988)
     Archive identifier:
       vhs-tape-1988-kelo-knots-landing-dynasty-cbs-tuesday-movie-murphys-romance-sharing-richard
     Late-1980s off-air compilation anchored by soap operas.
     ──────────────────────────────────────────────────────────── */
  {
    id: "kelo-1988-knots-landing-dynasty-vhs",
    type: "vhs",
    title: "VHS Tape — KELO 1988: Knots Landing, Dynasty & CBS Tuesday Movie",
    years: "1988",
    genre: ["Drama", "Soap Opera", "Romance", "VHS Recording"],
    rating: "TV-PG",
    score: 7.9,
    description:
      "A six-hour off-air VHS recording from KELO-TV in Sioux Falls, South Dakota, preserving an evening of late-1980s American television complete with original commercials and news breaks. The tape includes episodes or portions of Knots Landing and Dynasty, plus the CBS Tuesday Movie presentation of Murphy's Romance and additional material identified as Sharing Richard. As a home-recorded snapshot of network programming, advertising, and primetime soap-opera culture in 1988, it offers exactly the kind of archival broadcast ephemera this collection highlights.",
    thumbnail: "https://archive.org/services/img/vhs-tape-1988-kelo-knots-landing-dynasty-cbs-tuesday-movie-murphys-romance-sharing-richard",
    featured: false,
    episodes: [
      {
        id: "kelo-1988-knots-landing-dynasty-vhs-full",
        title: "Full Tape — KELO 1988: Knots Landing, Dynasty & Murphy's Romance",
        season: 0,
        episode: 0,
        year: 1988,
        duration: "360 min",
        description:
          "Six-hour KELO off-air VHS from 1988 featuring Knots Landing, Dynasty, the CBS Tuesday Movie Murphy's Romance, and period commercials/news breaks.",
        archiveId: "vhs-tape-1988-kelo-knots-landing-dynasty-cbs-tuesday-movie-murphys-romance-sharing-richard",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/vhs-tape-1988-kelo-knots-landing-dynasty-cbs-tuesday-movie-murphys-romance-sharing-richard",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     KNOTS LANDING / TODAY (PARTIAL, SAS-7)  (1989)
     Archive identifier: knots-landing-nbc-sunday-today-partial-sas-7-31-07-89
     Partial Australian off-air recording featuring Knots Landing.
     ──────────────────────────────────────────────────────────── */
  {
    id: "knots-landing-sas7-1989-07-31-partial",
    type: "vhs",
    title: "Knots Landing / Today (Partial, SAS-7, July 31 1989)",
    years: "1989",
    genre: ["Drama", "Soap Opera", "VHS Recording"],
    rating: "TV-PG",
    score: 7.6,
    description:
      "A partial off-air capture from Australia's SAS-7/Channel Seven dated July 31, 1989. The recording preserves the final 26 minutes of Knots Landing followed by the opening 22 minutes of Today, along with a rich layer of station continuity, promos, and commercials for late-1980s Australian television. Even in incomplete form, it is a vivid snapshot of how the prime-time soap travelled internationally and how local broadcasters packaged imported American drama.",
    thumbnail: "https://archive.org/services/img/knots-landing-nbc-sunday-today-partial-sas-7-31-07-89",
    featured: false,
    episodes: [
      {
        id: "knots-landing-sas7-1989-07-31-partial-full",
        title: "Knots Landing / Today (Partial Broadcast)",
        season: 0,
        episode: 0,
        year: 1989,
        duration: "48 min",
        description:
          "Partial July 31, 1989 SAS-7 recording with the end of Knots Landing, the start of Today, and original Australian promos and commercials.",
        archiveId: "knots-landing-nbc-sunday-today-partial-sas-7-31-07-89",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/knots-landing-nbc-sunday-today-partial-sas-7-31-07-89",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     KNOTS LANDING — CBS / WOC (INCOMPLETE)  (1991)
     Archive identifier: Knots_Landing_CBS_WOC_1991-05-09_Incomplete
     Incomplete off-air broadcast with original commercials.
     ──────────────────────────────────────────────────────────── */
  {
    id: "knots-landing-cbs-woc-1991-05-09-incomplete",
    type: "vhs",
    title: "Knots Landing (CBS/WOC, May 9 1991, Incomplete)",
    years: "1991",
    genre: ["Drama", "Soap Opera", "VHS Recording"],
    rating: "TV-PG",
    score: 7.7,
    description:
      "An incomplete VHS preservation of Knots Landing as aired on CBS via WOC on May 9, 1991, complete with original commercial breaks from the broadcast night. Captured near the end of the series' twelfth season, the recording offers another valuable slice of prime-time soap-opera history and the kind of unfiltered network-TV atmosphere that only off-air tapes preserve.",
    thumbnail: "https://archive.org/services/img/Knots_Landing_CBS_WOC_1991-05-09_Incomplete",
    featured: false,
    episodes: [
      {
        id: "knots-landing-cbs-woc-1991-05-09-incomplete-full",
        title: "Knots Landing (May 9, 1991 Broadcast, Incomplete)",
        season: 12,
        episode: 0,
        year: 1991,
        duration: "60 min",
        description:
          "Incomplete May 9, 1991 off-air Knots Landing broadcast from CBS/WOC with original commercials intact.",
        archiveId: "Knots_Landing_CBS_WOC_1991-05-09_Incomplete",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/Knots_Landing_CBS_WOC_1991-05-09_Incomplete",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     KNOTS LANDING — ATN-7 (INCOMPLETE)  (1986)
     Archive identifier: knots-landing-incomplete-atn-7-16-08-86
     Incomplete Australian off-air recording with promos/commercials.
     ──────────────────────────────────────────────────────────── */
  {
    id: "knots-landing-atn7-1986-08-16-incomplete",
    type: "vhs",
    title: "Knots Landing (ATN-7, August 16 1986, Incomplete)",
    years: "1986",
    genre: ["Drama", "Soap Opera", "VHS Recording"],
    rating: "TV-PG",
    score: 7.5,
    description:
      "An incomplete off-air VHS recording of Knots Landing from Channel Seven Sydney (ATN-7), dated August 16, 1986. Only the first 24 minutes of the episode survive, but the tape also preserves a rich layer of Australian promos and commercial breaks — including spots for Punky Brewster, Sons & Daughters, product advertising, and other period programming. Even in fragmentary form, it is a fascinating international time capsule of how the series aired abroad.",
    thumbnail: "https://archive.org/services/img/knots-landing-incomplete-atn-7-16-08-86",
    featured: false,
    episodes: [
      {
        id: "knots-landing-atn7-1986-08-16-incomplete-full",
        title: "Knots Landing (ATN-7 Broadcast, Incomplete)",
        season: 8,
        episode: 0,
        year: 1986,
        duration: "24 min",
        description:
          "First 24 minutes of an August 16, 1986 ATN-7 Knots Landing broadcast, preserved with original Australian promos and commercials.",
        archiveId: "knots-landing-incomplete-atn-7-16-08-86",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/knots-landing-incomplete-atn-7-16-08-86",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     INSPECTOR GADGET  (1983–1986)
     Archive identifier: inspector-gadget-go-go-gadget-series
     Animated comedy-adventure series created by Bruno Bianchi,
     Andy Heyward, and Jean Chalopin.
     ──────────────────────────────────────────────────────────── */
  {
    id: "inspector-gadget-1983",
    type: "tv",
    title: "Inspector Gadget",
    years: "1983–1986",
    genre: ["Animation", "Comedy", "Adventure", "Family", "Kids"],
    rating: "TV-Y7",
    score: 7.4,
    description:
      "The bumbling but well-meaning cyborg detective Inspector Gadget takes on the sinister schemes of Dr. Claw and M.A.D. with help from his resourceful niece Penny and loyal dog Brain. This classic 1980s animated series blends slapstick comedy, spy capers, and gadget-fueled chaos in every mission.",
    thumbnail: "https://archive.org/services/img/inspector-gadget-go-go-gadget-series",
    featured: false,
    episodes: [
      {
        id: "inspector-gadget-1983-s01e01",
        title: "Inspector Gadget (Archive Series Entry)",
        season: 1,
        episode: 1,
        year: 1983,
        duration: "22 min",
        description:
          "A classic Inspector Gadget episode from the Archive series collection featuring Gadget, Penny, and Brain taking on Dr. Claw and M.A.D.",
        archiveId: "inspector-gadget-go-go-gadget-series", archiveFile: "Inspector Gadget S01E01 Winter Olympics.mp4",
        thumbnail: "https://archive.org/services/img/inspector-gadget-go-go-gadget-series",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     DUNGEONS & DRAGONS  (1983–1985)
     Archive identifier:
       dungeons-dragons-1983-s-02-e-01-the-girl-who-dreamed-tomorrow-1080p-hd-upscale
     Classic animated fantasy adventure series.
     ──────────────────────────────────────────────────────────── */
  {
    id: "dungeons-dragons-1983",
    type: "tv",
    title: "Dungeons & Dragons",
    years: "1983–1985",
    genre: ["Animation", "Fantasy", "Adventure", "Kids", "Family"],
    rating: "TV-Y7",
    score: 8.0,
    description:
      "A group of kids are transported to the magical Realm and must survive dangerous quests while trying to find their way home, guided by the mysterious Dungeon Master.",
    thumbnail:
      "https://archive.org/services/img/dungeons-dragons-1983-s-02-e-01-the-girl-who-dreamed-tomorrow-1080p-hd-upscale",
    featured: false,
    episodes: [
      {
        id: "dungeons-dragons-1983-s02e01",
        title: "The Girl Who Dreamed Tomorrow",
        season: 2,
        episode: 1,
        year: 1984,
        duration: "24 min",
        description:
          "The friends encounter Terri, a girl with prophetic dreams that reveal future dangers, forcing the party to race against fate to survive.",
        archiveId: "dungeons-dragons-1983-s-02-e-01-the-girl-who-dreamed-tomorrow-1080p-hd-upscale", archiveFile: "Dungeons & Dragons (1983) - S02E01 - The Girl Who Dreamed Tomorrow (1080p HD Upscale).mp4",
        thumbnail:
          "https://archive.org/services/img/dungeons-dragons-1983-s-02-e-01-the-girl-who-dreamed-tomorrow-1080p-hd-upscale",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     READING RAINBOW  (1983–2006)
     Archive collection: ReadingRainbowTVSeries
     Each episode is an individual item on the Internet Archive.
     Identifiers follow the pattern ReadingRainbow[SS][EE].
     ──────────────────────────────────────────────────────────── */
  {
    id: "reading-rainbow",
    type: "tv",
    title: "Reading Rainbow",
    years: "1983–2006",
    genre: ["Educational", "Family", "Kids"],
    rating: "TV-G",
    score: 9.0,
    description:
      "Hosted by LeVar Burton, Reading Rainbow inspires children to read by bringing beloved picture books to life through stunning visuals, celebrity narrators, and young reviewers. Each episode centers on a featured book and explores its themes through field trips, demonstrations, and joyful storytelling.",
    thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
    featured: true,
    episodes: [
      /* ── Season 1 (1983) ── */
      {
        id: "rr-s01e01", title: "Tight Times", season: 1, episode: 1,
        year: 1983, duration: "30 min",
        description: "LeVar explores ways to have fun on a tight budget, featuring the book Tight Times by Barbara Shook Hazen about a boy learning to cope with his family's financial struggles.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E01.Tight.Times.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e02", title: "Miss Nelson Is Back", season: 1, episode: 2,
        year: 1983, duration: "30 min",
        description: "When their teacher is out sick, a class of rowdy students must deal with the return of the terrifying Miss Viola Swamp. Based on the book by Harry Allard and James Marshall.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E02.Miss.Nelson.is.Back.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e03", title: "Bea and Mr. Jones", season: 1, episode: 3,
        year: 1983, duration: "30 min",
        description: "LeVar tries out new identities as a kindergartner and her father swap places for a day. Based on the book by Amy Schwartz, exploring imagination and empathy.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E03.Bea.and.Mr.Jones.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e04", title: "Bringing the Rain to Kapiti Plain", season: 1, episode: 4,
        year: 1983, duration: "30 min",
        description: "A young Kenyan herdsman finds a way to bring rain to his drought-stricken land. Based on the rhythmic Nandi folktale retold by Verna Aardema, with a field trip exploring weather.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E04.Bringing.the.Rain.to.Kapiti.Plain.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e05", title: "Louis the Fish", season: 1, episode: 5,
        year: 1983, duration: "30 min",
        description: "A miserable butcher dreams of being a fish, and one day his dream comes true. Based on the surreal picture book by Arthur Yorinks, with LeVar exploring marine life.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E05.Louis.the.Fish.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e06", title: "Digging Up Dinosaurs", season: 1, episode: 6,
        year: 1983, duration: "30 min",
        description: "LeVar visits Dinosaur National Monument and explores how paleontologists uncover dinosaur bones. Features the book Digging Up Dinosaurs by Aliki.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E06.Digging.Up.Dinosaurs.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e07", title: "Liang and the Magic Paintbrush", season: 1, episode: 7,
        year: 1983, duration: "30 min",
        description: "A poor Chinese boy's magic paintbrush brings everything he draws to life. Based on the book by Demi, with a field trip celebrating Chinese-American art and culture.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E07.Liang.and.the.Magic.Paintbrush.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e08", title: "Gila Monsters Meet You at the Airport", season: 1, episode: 8,
        year: 1983, duration: "30 min",
        description: "A New York City boy dreads moving out West, convinced it is full of fearsome creatures. Based on the book by Marjorie Weinman Sharmat, with LeVar exploring desert wildlife.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E08.Gila.Monsters.Meet.You.at.the.Airport.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e09", title: "Three Days on a River in a Red Canoe", season: 1, episode: 9,
        year: 1983, duration: "30 min",
        description: "A family embarks on a camping and canoeing trip and enjoys the wonders of the outdoors. Based on the book by Vera B. Williams, with LeVar joining a river adventure.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E09.Three.Days.on.a.River.in.a.Red.Canoe.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e10", title: "The Gift of the Sacred Dog", season: 1, episode: 10,
        year: 1983, duration: "30 min",
        description: "A young Native American boy prays for help for his starving people and receives the gift of the horse. Based on the book by Paul Goble, celebrating Plains Indian culture and legend.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E10.The.Gift.of.the.Sacred.Dog.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e11", title: "Gregory the Terrible Eater", season: 1, episode: 11,
        year: 1983, duration: "30 min",
        description: "Gregory the goat refuses to eat garbage like a normal goat and insists on fruits and vegetables, much to his parents' alarm. Based on the book by Mitchell Sharmat, with a look at nutrition.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E11.Gregory.the.Terrible.Eater.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e12", title: "Three by the Sea", season: 1, episode: 12,
        year: 1983, duration: "30 min",
        description: "Three friends spend a day at the beach and take turns telling each other stories. Based on the book by Edward Marshall, exploring storytelling, creativity, and cooperation.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E12.Three.By.the.Sea.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e13", title: "Arthur's Eyes", season: 1, episode: 13,
        year: 1983, duration: "30 min",
        description: "Arthur the aardvark gets glasses and struggles with teasing from classmates, learning to accept himself. Based on the book by Marc Brown, with LeVar exploring the importance of vision care.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E13.Arthurs.Eyes.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e14", title: "The Day Jimmy's Boa Ate the Wash", season: 1, episode: 14,
        year: 1983, duration: "30 min",
        description: "A girl recounts an increasingly absurd chain of events that happened on a class trip to a farm. Based on the hilarious book by Trinka Hakes Noble, with LeVar visiting a real farm.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E14.The.Day.Jimmys.Boa.Ate.the.Wash.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s01e15", title: "Ty's One-Man Band", season: 1, episode: 15,
        year: 1983, duration: "30 min",
        description: "A mysterious one-legged stranger arrives in a small town and creates music from everyday objects. Based on the book by Mildred Pitts Walter, celebrating the joy of music and creativity.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S01E15.Tys.One-Man.Band.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      /* ── Season 2 (1984) ── */
      {
        id: "rr-s02e01", title: "Hot-Air Henry", season: 2, episode: 1,
        year: 1984, duration: "30 min",
        description: "A Siamese cat stows away on a hot-air balloon and takes a high-flying adventure. Based on the book by Mary Calhoun, with LeVar exploring the world of hot-air ballooning.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S02E01.Hot-Air.Henry.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s02e02", title: "Simon's Book", season: 2, episode: 2,
        year: 1984, duration: "30 min",
        description: "A boy falls asleep while drawing and his character comes to life in the story. Based on the imaginative book by Henrik Drescher, with a look at the art of illustration.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S02E02.Simons.Book.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s02e03", title: "Ox-Cart Man", season: 2, episode: 3,
        year: 1984, duration: "30 min",
        description: "A New England farmer loads his ox cart and travels to market to sell everything his family has made. Based on the Caldecott Medal book by Donald Hall, exploring colonial American life.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S02E03.Ox-Cart.Man.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s02e04", title: "Mystery on the Docks", season: 2, episode: 4,
        year: 1984, duration: "30 min",
        description: "Ralph the rat is an opera-loving short-order cook whose favorite opera singer is kidnapped. Based on the musical mystery book by Thacher Hurd, with a behind-the-scenes look at opera.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S02E04.Mystery.on.the.Docks.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s02e05", title: "A Chair for My Mother", season: 2, episode: 5,
        year: 1984, duration: "30 min",
        description: "A young girl, her mother, and grandmother save their coins to buy a big, comfortable chair after losing their furniture in a fire. Based on the Caldecott Honor book by Vera B. Williams.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S02E05.A.Chair.for.My.Mother.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      /* ── Season 3 (1985) ── */
      {
        id: "rr-s03e01", title: "Paul Bunyan", season: 3, episode: 1,
        year: 1985, duration: "30 min",
        description: "The legendary giant lumberjack and his enormous blue ox Babe roam across America performing impossible feats. Based on the tall tale retold by Steven Kellogg, celebrating American folklore.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S03E01.Paul.Bunyan.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s03e02", title: "The Patchwork Quilt", season: 3, episode: 2,
        year: 1985, duration: "30 min",
        description: "A young girl helps her ailing grandmother finish a quilt that tells the story of their family. Based on the book by Valerie Flournoy, with LeVar exploring the art and history of quilting.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S03E02.The.Patchwork.Quilt.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s03e03", title: "Hill of Fire", season: 3, episode: 3,
        year: 1985, duration: "30 min",
        description: "A Mexican farmer witnesses the birth of a volcano in his corn field — the true story of the Paricutín volcano. Based on the book by Thomas P. Lewis, with a look at how volcanoes form.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S03E03.Hill.of.Fire.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s03e04", title: "The Tortoise and the Hare", season: 3, episode: 4,
        year: 1985, duration: "30 min",
        description: "Aesop's classic fable of the slow but steady tortoise who outpaces the overconfident hare. Based on Janet Stevens' retelling, with LeVar exploring lessons on perseverance and fair play.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S03E04.The.Tortoise.and.the.Hare.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
      {
        id: "rr-s03e05", title: "Perfect the Pig", season: 3, episode: 5,
        year: 1985, duration: "30 min",
        description: "A little pig wishes to grow wings and fly and one day his wish comes true, leading to adventures and friendship. Based on the book by Susan Jeschke, with a look at animal care.",
        archiveId: "ReadingRainbowTVSeries", archiveFile: "Reading.Rainbow.S03E05.Perfect.the.Pig.480p.AMZN.WEB-DL.DD.2.0.x264-RTN.mp4",
        thumbnail: "https://archive.org/services/img/ReadingRainbowTVSeries",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     SATURDAY SUPERCADE  (1983–1984)
     Archive identifier: youtube-JYYzz8BUg9E
     Full 1983 broadcast recording (commercials included).
     ──────────────────────────────────────────────────────────── */
  {
    id: "saturday-supercade",
    type: "tv",
    title: "Saturday Supercade",
    years: "1983–1984",
    genre: ["Animation", "Family", "Comedy"],
    rating: "TV-G",
    score: 7.1,
    description:
      "CBS's beloved Saturday-morning animated anthology starring characters from the golden age of arcade games. Each episode features multiple short segments following Donkey Kong, Frogger, Q*bert, Pitfall Harry, and others in all-new comedic adventures.",
    thumbnail: "https://archive.org/services/img/youtube-JYYzz8BUg9E",
    featured: false,
    episodes: [
      {
        id: "ssc-s01-archive",
        title: "Saturday Supercade — 1983 Broadcast Recording",
        season: 1,
        episode: 1,
        year: 1983,
        duration: "varies",
        description:
          "Archived recording of the 1983 CBS run of Saturday Supercade, featuring Donkey Kong, Frogger, Donkey Kong Jr., Pitfall!, and Q*bert segments — commercials included.",
        archiveId: "youtube-JYYzz8BUg9E",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/youtube-JYYzz8BUg9E",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THOMAS THE TANK ENGINE & FRIENDS  (1984–1998)
     BBC/ITV children's series based on the Railway Series books
     by Rev. W. Awdry. Narrated by Ringo Starr (Series 1–2) and
     then Michael Angelis (UK) / George Carlin (US, Series 3–7).
     Archive identifier (Series 1–5):
       thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98
     archiveIndex maps to sequential episode number (0-based) within
     the archive item's file listing.
     ──────────────────────────────────────────────────────────── */
  {
    id: "thomas-the-tank-engine",
    type: "tv",
    title: "Thomas the Tank Engine & Friends",
    years: "1984–1998",
    genre: ["Animation", "Family", "Comedy"],
    rating: "TV-G",
    score: 8.1,
    description:
      "Based on Rev. W. Awdry's beloved Railway Series books, Thomas the Tank Engine & Friends follows the adventures of Thomas and his engine companions — James, Gordon, Henry, Percy, and many more — on the Island of Sodor. Narrated by Ringo Starr for the first two series, the gentle stop-motion series taught generations of children lessons about friendship, responsibility, and hard work. Series 1–5 aired from 1984 to 1998.",
    thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
    featured: false,
    episodes: [
      /* ── Series 1 (1984) ── */
      {
        id: "ttef-s01e01",
        title: "Thomas and Gordon",
        season: 1,
        episode: 1,
        year: 1984,
        duration: "5 min",
        description:
          "Thomas the small tank engine is tired of his job shunting coaches in the yard and longs to pull a train. He teases the big engine Gordon about getting tired, but Gordon soon teaches Thomas a lesson he won't forget.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E01 - Thomas and Gordon.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e02",
        title: "Edward and Gordon",
        season: 1,
        episode: 2,
        year: 1984,
        duration: "5 min",
        description:
          "Kind old Edward is given a chance to pull a train, but Gordon mocks him for being too slow. When Gordon breaks down on a hill, only Edward is willing to push him to the top, earning the big engine's respect.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E02 - Edward and Gordon.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e03",
        title: "The Sad Story of Henry",
        season: 1,
        episode: 3,
        year: 1984,
        duration: "5 min",
        description:
          "Henry the green engine stops in a tunnel because he is afraid the rain will spoil his paint. He refuses to come out, and the Fat Controller has him bricked up inside as punishment — a cautionary tale about vanity.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E03 - The Sad Story of Henry.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e04",
        title: "Edward, Gordon and Henry",
        season: 1,
        episode: 4,
        year: 1984,
        duration: "5 min",
        description:
          "Gordon's axle breaks down, leaving the express stranded. The Fat Controller releases Henry from the tunnel to rescue the coaches — Henry's first chance to prove he can be a Really Useful Engine.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E04 - Edward, Gordon and Henry.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e05",
        title: "Thomas's Train",
        season: 1,
        episode: 5,
        year: 1984,
        duration: "5 min",
        description:
          "Thomas finally gets to pull a train on his own — but in his excitement he races away before the coaches are coupled on and ends up on the main line without them, causing confusion across the whole railway.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E05 - Thomas' Train.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e06",
        title: "Thomas and the Trucks",
        season: 1,
        episode: 6,
        year: 1984,
        duration: "5 min",
        description:
          "Thomas is pleased to be given a goods train, but the troublesome trucks push him faster and faster down the hill until he crashes through the buffers at the harbour. Thomas learns that goods trains require just as much care as passenger coaches.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E06 - Thomas and the Trucks.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e07",
        title: "Thomas and the Breakdown Train",
        season: 1,
        episode: 7,
        year: 1984,
        duration: "5 min",
        description:
          "James the red engine crashes and blocks the main line. Thomas, who has been left minding the breakdown train, must rescue James and clear the line — his first real chance to be a Really Useful Engine.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E07 - Thomas and the Breakdown Train.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e08",
        title: "James and the coaches",
        season: 1,
        episode: 8,
        year: 1984,
        duration: "5 min",
        description:
          "James is given old wooden coaches for his first proper passenger run and complains bitterly. When a leaking coach hose causes him to brake sharply and rip the coach's side off, the Fat Controller is most displeased.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E08 - James and the Coaches.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e09",
        title: "Troublesome Trucks",
        season: 1,
        episode: 9,
        year: 1984,
        duration: "5 min",
        description:
          "James is still sulking in the shed after his mishap. Gordon and Henry refuse to shunt James's trucks, insisting it is beneath them. Thomas cheerfully does the job — demonstrating that no honest work is too small for a Really Useful Engine.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E09 - Troublesome Trucks.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e10",
        title: "James and the express",
        season: 1,
        episode: 10,
        year: 1984,
        duration: "5 min",
        description:
          "James is at last allowed to pull the express and sets off full of pride. But his inexperience with the heavy train nearly leads to disaster, and only the quick thinking of his driver saves the day.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E10 - James and the Express.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e11",
        title: "Thomas and the Guard",
        season: 1,
        episode: 11,
        year: 1984,
        duration: "5 min",
        description:
          "Thomas's guard is left behind at the station. Thomas sets off without him and cannot stop properly because only the guard has the brake van. The runaway branch-line adventure teaches Thomas the importance of the whole team.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E11 - Thomas and the Guard.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e12",
        title: "Thomas Goes Fishing",
        season: 1,
        episode: 12,
        year: 1984,
        duration: "5 min",
        description:
          "Thomas passes a river every day and wishes he could stop to fish like the people on the bank. When his water pump fails and he must take on water from the river, he gets rather more fish than he bargained for.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E12 - Thomas Goes Fishing.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e13",
        title: "Thomas, Terence and the Snow",
        season: 1,
        episode: 13,
        year: 1984,
        duration: "5 min",
        description:
          "When the first snow of winter falls, Thomas mocks Terence the Tractor's caterpillar tracks. But a heavy snowfall blocks Thomas's line and it is Terence who must rescue him — teaching Thomas not to judge others.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E13 - Thomas, Terence and the Snow.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e14",
        title: "Thomas and Bertie",
        season: 1,
        episode: 14,
        year: 1984,
        duration: "5 min",
        description:
          "Bertie the Bus challenges Thomas to a race. Thomas is determined to beat him, speeding along his branch line while Bertie takes the road. The close-run contest delights the Fat Controller and becomes the talk of Sodor.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E14 - Thomas and Bertie.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e15",
        title: "Tenders and Turntables",
        season: 1,
        episode: 15,
        year: 1984,
        duration: "5 min",
        description:
          "Gordon, Henry, and James travel to a big station far away. Without a turntable large enough for tender engines, they must run backwards home — and discover it is far harder and more undignified than they imagined.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E15 - Tenders and Turntables.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e16",
        title: "Trouble in the Shed",
        season: 1,
        episode: 16,
        year: 1984,
        duration: "5 min",
        description:
          "Gordon, Henry, and James go on strike and refuse to leave the shed. Thomas has to do all the work on his own, causing such disruption that the Fat Controller is forced to bring in a new engine — Edward — to restore order.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E16 - Trouble in the Shed.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e17",
        title: "Percy Runs Away",
        season: 1,
        episode: 17,
        year: 1984,
        duration: "5 min",
        description:
          "Percy the small green engine is tricked by the bigger engines into believing he must go fast to avoid a signal check. He races out of the shed and along the line until his driver and fireman manage to slow him down.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E17 - Percy Runs Away.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e18",
        title: "Coal",
        season: 1,
        episode: 18,
        year: 1984,
        duration: "5 min",
        description:
          "Henry's special Welsh coal runs out and he must burn ordinary coal, which gives him a terrible cough and makes him very slow. The Fat Controller tries every remedy until the right coal is found and Henry is restored to full strength.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E18 - Coal.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e19",
        title: "The Flying Kipper",
        season: 1,
        episode: 19,
        year: 1984,
        duration: "5 min",
        description:
          "Henry is given the special honour of pulling the Flying Kipper fish train through the cold winter night. A frozen signal leaves the line set to the wrong track and Henry crashes into a goods train, putting him in the works for a much-needed rebuild.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E19 - The Flying Kipper.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s01e20",
        title: "Whistles and Sneezes",
        season: 1,
        episode: 20,
        year: 1984,
        duration: "5 min",
        description:
          "Henry comes back from the works gleaming and improved, but he now has a habit of sneezing coal dust onto other engines. Gordon and James are furious until Henry's sneezing saves the day when a runaway horse blocks the line.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S01E20 - Whistles and Sneezes.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      /* ── Series 2 (1986) ── */
      {
        id: "ttef-s02e01",
        title: "Percy and the Signal",
        season: 2,
        episode: 1,
        year: 1986,
        duration: "5 min",
        description:
          "Percy tells Gordon about the importance of signals, but is then tricked by the big engines into misreading one. He speeds into a goods siding and crashes into a load of lime — turning him ghostly white and teaching him not to be too clever.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S02E01 - Thomas, Percy and the Coal.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s02e02",
        title: "Duck Takes Charge",
        season: 2,
        episode: 2,
        year: 1986,
        duration: "5 min",
        description:
          "Duck the Great Western engine arrives on Sodor and soon clashes with the bigger engines, who try to boss him around. Duck politely but firmly tells them that on his part of the railway, engines do as they are told — by the Fat Controller.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S02E02 - Cows.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s02e03",
        title: "Percy and Harold",
        season: 2,
        episode: 3,
        year: 1986,
        duration: "5 min",
        description:
          "Harold the helicopter brags that railways are slow and out of date. Percy challenges him to a race and, with his driver giving him full steam, beats Harold to the harbour — proving that a good engine can still hold its own against modern machines.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S02E03 - Bertie's Chase.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s02e04",
        title: "The Diseasel",
        season: 2,
        episode: 4,
        year: 1986,
        duration: "5 min",
        description:
          "A new diesel engine nicknamed 'Diseasel' arrives on Sodor and causes trouble by slyly making the other engines look bad. Duck refuses to be fooled and exposes the diesel's tricks to the Fat Controller.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S02E04 - Saved from Scrap.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s02e05",
        title: "Better Late Than Never",
        season: 2,
        episode: 5,
        year: 1986,
        duration: "5 min",
        description:
          "James loses time helping a farmer whose sheep have strayed onto the line. He arrives late at the junction and finds Gordon very impatient — but a kind word from Edward reminds the engines that being helpful is always worth a delay.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S02E05 - Old Iron.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s02e06",
        title: "Break Van",
        season: 2,
        episode: 6,
        year: 1986,
        duration: "5 min",
        description:
          "Donald and Douglas, the Scottish twin engines, arrive on Sodor on trial. Only one can stay. The other engines try to help them keep their jobs, and a brave act of rescue by one of the twins finally convinces the Fat Controller to keep them both.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S02E06 - Thomas and Trevor.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      /* ── Series 3 (1991) ── */
      {
        id: "ttef-s03e01",
        title: "A Scarf for Percy",
        season: 3,
        episode: 1,
        year: 1991,
        duration: "5 min",
        description:
          "On a cold winter morning Percy borrows a passenger's scarf to keep his boiler warm, but it catches in his wheels and causes a minor derailment. Percy learns that borrowed things must be treated with extra care.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S03E01 - A Scarf for Percy.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s03e02",
        title: "Buzz Buzz",
        season: 3,
        episode: 2,
        year: 1991,
        duration: "5 min",
        description:
          "A wasps' nest hidden in a truck causes chaos when the wasps escape and sting the engines and their crews. Thomas's quick thinking gets the truck to a siding before the situation becomes a full railway emergency.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S03E02 - Percy's Promise.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s03e03",
        title: "Diesel's Devious Deed",
        season: 3,
        episode: 3,
        year: 1991,
        duration: "5 min",
        description:
          "Diesel returns to Sodor and spreads lies about Duck to the trucks, turning them against him. The Fat Controller discovers the truth and sends Diesel away while Duck's good name is restored.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S03E03 - Time for Trouble.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s03e04",
        title: "Thomas, Percy and the Dragon",
        season: 3,
        episode: 4,
        year: 1991,
        duration: "5 min",
        description:
          "Thomas and Percy scare each other with ghost stories. When they spot a Chinese dragon float being transported for a festival, both engines think their stories have come true — and each is convinced the other is just as frightened as himself.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S03E04 - Gordon and the Famous Visitor.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      /* ── Series 4 (1994) ── */
      {
        id: "ttef-s04e01",
        title: "Wrong Road",
        season: 4,
        episode: 1,
        year: 1994,
        duration: "5 min",
        description:
          "Gordon boasts that he always knows the right road. When a mix-up at a junction sends him down the wrong branch line, he must eat humble pie and ask Thomas and Percy to help him turn around.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S04E01 - Granpuff.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s04e02",
        title: "Oliver Owns Up",
        season: 4,
        episode: 2,
        year: 1994,
        duration: "5 min",
        description:
          "Oliver the Great Western engine makes an embarrassing mistake with the trucks and tries to hide it. With encouragement from Duck, he confesses to the Fat Controller — discovering that honesty is always the better course.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S04E02 - Sleeping Beauty.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s04e03",
        title: "Sleeping Beauty",
        season: 4,
        episode: 3,
        year: 1994,
        duration: "5 min",
        description:
          "A rusty old coach named Henrietta is rediscovered in a siding. Toby is given the job of bringing her back into service, and together they make the branch line complete once more.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S04E03 - Bulldog.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      /* ── Series 5 (1995–1998) ── */
      {
        id: "ttef-s05e01",
        title: "Percy's Promise",
        season: 5,
        episode: 1,
        year: 1995,
        duration: "5 min",
        description:
          "Percy promises to collect a group of children from a fair. When a storm washes out part of the line, Percy pushes through flood water to keep his word — arriving soaking wet but right on time, to everyone's delight.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S05E01 - Cranky Bugs.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s05e02",
        title: "Thomas and the Rumours",
        season: 5,
        episode: 2,
        year: 1995,
        duration: "5 min",
        description:
          "Rumours spread around Sodor that the engines are to be replaced by buses. Each engine worries and passes the story along, growing wilder with each telling — until the Fat Controller reveals the truth and peace is restored.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S05E02 - Horrid Lorry.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
      {
        id: "ttef-s05e03",
        title: "Toby's Tightrope",
        season: 5,
        episode: 3,
        year: 1995,
        duration: "5 min",
        description:
          "Toby the tram engine must cross a narrow, rickety viaduct on his branch line. The other engines think he is too slow and old-fashioned, but only Toby can navigate the tricky crossing — and his careful precision saves the day.",
        archiveId: "thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98", archiveFile: "S05E03 - A Better View for Gordon.mp4",
        thumbnail: "https://archive.org/services/img/thomas-the-tank-engine-friends-the-complete-series-1-5-1984-98",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     HEATHCLIFF AND THE CATILLAC CATS  (1984–1988)
     First-run syndication animated series produced by DiC
     Entertainment. 65 half-hour episodes, each containing two
     segments: a Heathcliff segment and a Catillac Cats segment.
     Archive identifier: heathcliff-and-the-catillac-cats-1984-complete-series
     archiveIndex maps to sequential episode number (0-based).
     ──────────────────────────────────────────────────────────── */
  {
    id: "heathcliff-and-the-catillac-cats",
    type: "tv",
    title: "Heathcliff and the Catillac Cats",
    years: "1984–1988",
    genre: ["Animation", "Family", "Comedy"],
    rating: "TV-G",
    score: 7.4,
    description:
      "The mischievous orange tabby Heathcliff terrorizes the neighborhood of Westfinster in short comedic adventures, while a second segment follows the Catillac Cats — Riff, Mungo, Hector, Wordsworth, and Cleo — a gang of streetwise alley cats who rule Pussycat Junkyard from their prized Cadillac. Produced by DiC Entertainment and aired in first-run syndication, the series ran 65 episodes from 1984 to 1988.",
    thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
    featured: false,
    episodes: [
      {
        id: "hcc-s01e01",
        title: "Garbage Monster / Brush with Fame",
        season: 1,
        episode: 1,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff turns neighborhood garbage into a towering garbage creature to frighten away rivals. Then the Catillac Cats attempt to muscle their way into the art world when Cleo paints a portrait that causes a sensation across Pussycat Junkyard.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e02",
        title: "Heathcliff's Rival / Tag Team",
        season: 1,
        episode: 2,
        year: 1984,
        duration: "22 min",
        description:
          "A slick new tomcat arrives in Westfinster and challenges Heathcliff for the affections of Sonja and the run of the neighborhood. Meanwhile, Riff and Mungo enter a wrestling tournament convinced the championship trophy will earn them the respect — and free food — they crave.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 1,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e03",
        title: "The Big Boo / Something's Fishy",
        season: 1,
        episode: 3,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff discovers an abandoned house rumored to be haunted and uses the ghost stories to keep the neighborhood dogs at bay. Across town, the Catillac Cats hatch an elaborate scheme to hijack a delivery truck loaded with the finest canned tuna.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 2,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e04",
        title: "Bink's New Car / The Perfect Crime",
        season: 1,
        episode: 4,
        year: 1984,
        duration: "22 min",
        description:
          "Grandpa Nutmeg's grandson Iggy and his friend Bink get their hands on a go-kart, and Heathcliff promptly commandeers it for a high-speed joyride through Westfinster. The Catillac Cats plan an elaborate heist on the neighborhood fish market — but Wordsworth's over-complicated blueprint leads to predictably chaotic results.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 3,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e05",
        title: "Football Follies / Fur Frenzy",
        season: 1,
        episode: 5,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff infiltrates a neighborhood football game and single-pawedly disrupts both teams in pursuit of the half-time hot-dog cart. Riff convinces the gang to enter a pet show in disguise — only for the competition to turn into a full-scale junkyard stampede.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 4,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e06",
        title: "Skateboard Scam / Cat Nappers",
        season: 1,
        episode: 6,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff takes up skateboarding to impress Sonja and immediately makes mortal enemies of every dog on wheels in the neighborhood. The Catillac Cats discover that Cleo has been catnapped by a theatrical agent who intends to make her a TV star — whether she likes it or not.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 5,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e07",
        title: "The Winner / Catillac Racers",
        season: 1,
        episode: 7,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff enters every competition in Westfinster determined to win a trophy — even the ones he wasn't invited to. Meanwhile Riff bets the Catillac itself in a street race against a rival gang and must scramble to reclaim the car before sundown.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 6,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e08",
        title: "Rockula / The Big Scheme",
        season: 1,
        episode: 8,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff stumbles onto a horror-movie film set and is mistaken for the lead monster, sending the entire crew fleeing the lot. Hector talks the Catillac Cats into running a neighborhood protection racket — offering to guard Pussycat Junkyard from hazards entirely of their own making.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 7,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e09",
        title: "Dog Day After School / Show Stoppers",
        season: 1,
        episode: 9,
        year: 1984,
        duration: "22 min",
        description:
          "A gang of bulldogs blockades Iggy's school and only Heathcliff can outwit them — though his methods cause almost as much chaos as the dogs themselves. The Catillac Cats volunteer as stagehands for a neighborhood talent show, turning the curtain-raiser into an involuntary audition.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 8,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e10",
        title: "The Catfish / Wordsworth's Poem",
        season: 1,
        episode: 10,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff and a grumpy catfish wage a battle of wills at the local fishing pond, with Grandpa caught in the crossfire. Wordsworth submits an epic ode to tuna to a poetry contest and drags the rest of the Catillac Cats into a very reluctant reading tour.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 9,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e11",
        title: "The Big Sleep / Mungo's Muscles",
        season: 1,
        episode: 11,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff fakes a string of ailments to avoid the neighborhood vet, accidentally convincing everyone in Westfinster he is gravely ill. Mungo discovers a mail-order muscle-building kit and uses his new strength to settle every score in Pussycat Junkyard — until the kit's side-effects kick in.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 10,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e12",
        title: "Love Thy Neighbour / Riff's Big Date",
        season: 1,
        episode: 12,
        year: 1984,
        duration: "22 min",
        description:
          "A new family moves in next door with a pampered show-cat, and Heathcliff must decide whether to torment his new neighbor or recruit her as an ally against the neighborhood dogs. Riff prepares an elaborate romantic evening for Cleo, only for every member of the Catillac Cats gang to accidentally join the date.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 11,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
      {
        id: "hcc-s01e13",
        title: "Gone Fishin' / The Great Junkyard Race",
        season: 1,
        episode: 13,
        year: 1984,
        duration: "22 min",
        description:
          "Heathcliff stows away on Grandpa Nutmeg's fishing trip and proceeds to commandeer the boat, the bait, and the catch. The Catillac Cats enter the Catillac in a demolition derby-style junkyard race that quickly threatens to leave them without a car at all.",
        archiveId: "heathcliff-and-the-catillac-cats-1984-complete-series",
        archiveIndex: 12,
        thumbnail: "https://archive.org/services/img/heathcliff-and-the-catillac-cats-1984-complete-series",
      },
    ],
  },
  /* ────────────────────────────────────────────────────────────
     THE DUKES OF HAZZARD  (1979–1985)
     Christmas episode archive identifier: dukes-xmas
     "The Great Santa Claus Chase" — Season 3, Episode 9,
     originally aired December 18, 1981 on CBS.
     ──────────────────────────────────────────────────────────── */
  {
    id: "dukes-of-hazzard",
    type: "tv",
    title: "The Dukes of Hazzard",
    years: "1979–1985",
    genre: ["Action", "Comedy", "Adventure"],
    rating: "TV-PG",
    score: 7.2,
    description:
      "Bo and Luke Duke, their cousin Daisy, and Uncle Jesse continually outwit the corrupt Boss Hogg and bumbling Sheriff Rosco P. Coltrane across Hazzard County, Georgia — with plenty of car chases in their iconic orange Dodge Charger, the General Lee.",
    thumbnail: "https://archive.org/services/img/dukes-xmas",
    featured: false,
    episodes: [
      {
        id: "doh-s03e09",
        title: "The Great Santa Claus Chase",
        season: 3,
        episode: 9,
        year: 1981,
        duration: "48 min",
        description:
          "Boss Hogg schemes to steal charity money collected for Hazzard County's Christmas celebration. Bo, Luke, and Daisy race to stop him in a festive holiday chase that puts the General Lee up against a sleigh's worth of trouble.",
        archiveId: "dukes-xmas",
        archiveIndex: 0,
        thumbnail: "https://archive.org/services/img/dukes-xmas",
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
