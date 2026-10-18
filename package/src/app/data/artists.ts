export type Artist = {
  id: string
  name: string
  genre: string
  followers: string
  country: string
  blurb: string
  seedVotes: number
}

// Illustrative, fan-favorite headliners for the campaign concept.
// Vote counts are seeded and then driven by real, shared tallies from /api/poll.
export const ARTISTS: Artist[] = [
  {
    id: 'burna-boy',
    name: 'Burna Boy',
    genre: 'Afro-fusion',
    followers: '20M+',
    country: 'Nigeria',
    blurb: 'Grammy-winning "African giant" blending afrobeats, dancehall and hip-hop.',
    seedVotes: 4820,
  },
  {
    id: 'wizkid',
    name: 'Wizkid',
    genre: 'Afrobeats',
    followers: '18M+',
    country: 'Nigeria',
    blurb: 'Starboy architect of the modern Afrobeats wave going global.',
    seedVotes: 4310,
  },
  {
    id: 'davido',
    name: 'Davido',
    genre: 'Afrobeats',
    followers: '16M+',
    country: 'Nigeria',
    blurb: 'Sensational hitmaker behind crowd anthems and label Sounds CEO.',
    seedVotes: 3980,
  },
  {
    id: 'tems',
    name: 'Tems',
    genre: 'Afro-R&B',
    followers: '9M+',
    country: 'Nigeria',
    blurb: 'Velvet-vocal superstar bending R&B, afrobeats and gospel.',
    seedVotes: 3450,
  },
  {
    id: 'rema',
    name: 'Rema',
    genre: 'Afrapop',
    followers: '8M+',
    country: 'Nigeria',
    blurb: 'Mood-making Afrapop pioneer with a catchy, genre-blurring sound.',
    seedVotes: 3120,
  },
  {
    id: 'ayra-starr',
    name: 'Ayra Starr',
    genre: 'Afrobeats',
    followers: '7M+',
    country: 'Nigeria',
    blurb: 'Yé yé breakout voice redefining young African pop.',
    seedVotes: 2760,
  },
  {
    id: 'asake',
    name: 'Asake',
    genre: 'Amapiano',
    followers: '6M+',
    country: 'Nigeria',
    blurb: 'Amapiano-meets-afrobeats storyteller with chart-dominating runs.',
    seedVotes: 2410,
  },
  {
    id: 'omah-lay',
    name: 'Omah Lay',
    genre: 'Afro-fusion',
    followers: '5M+',
    country: 'Nigeria',
    blurb: 'Laid-back, introspective songwriting with irresistible hooks.',
    seedVotes: 2050,
  },
]
