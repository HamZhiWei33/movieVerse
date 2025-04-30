// not complete
// PIC TZW
export const users = [
  {
    id: "U1",
    email: "john.doe@example.com",
    fullName: "John Doe",
    username: "johndoe",
    password: "hashed_password_123",
    profilePic:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    watchlist: ["M101", "M102"], // Movie IDs
    likedMovies: ["M103"],
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "U2",
    email: "jane.smith@example.com",
    fullName: "Jane Smith",
    username: "janesmith",
    password: "hashed_password_456",
    profilePic:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    watchlist: ["M104", "M105"],
    likedMovies: ["M101", "M106"],
    createdAt: "2024-06-02T12:30:00Z",
  },
  {
    id: "U3",
    email: "jennie.lisa@example.com",
    fullName: "Jennie Lisa",
    username: "jennielisa",
    password: "passwordJennielisa123",
    profilePic:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    watchlist: ["M104", "M105"],
    likedMovies: ["M101", "M106"],
    createdAt: "2024-06-03T12:30:00Z",
  },
  {
    id: "U4",
    email: "yijin@example.com",
    fullName: "Yijin",
    username: "yijin",
    password: "passwordYijin123",
    profilePic:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/1200px-Cat_November_2010-1a.jpg",
    watchlist: ["M113", "M105"],
    likedMovies: ["M114", "M106"],
    createdAt: "2024-06-03T12:45:00Z",
  },
  {
    id: "U5",
    email: "penguin11@example.com",
    fullName: "Penguin11",
    username: "penguin",
    password: "passwordPenguin123",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFQUkXLkP65fs58H0PoRM63C32zJbNExDdLA&s",
    watchlist: ["M102", "M104"],
    likedMovies: ["M112", "M103"],
    createdAt: "2024-06-03T12:46:00Z",
  },
  {
    id: "U6",
    email: "shark@example.com",
    fullName: "Shark",
    username: "shark",
    password: "passwordShark123",
    profilePic:
      "https://t3.ftcdn.net/jpg/01/03/87/88/360_F_103878807_z84l8RHnL5VRhCVVp6zbA2lvVt2v80Zy.jpg",
    watchlist: ["M112", "M115"],
    likedMovies: ["M113", "M106"],
    createdAt: "2024-06-04T12:50:00Z",
  },
  {
    id: "U7",
    email: "dolphin@example.com",
    fullName: "Dolphin",
    username: "dolphin",
    password: "passwordDolphin123",
    profilePic:
      "https://plus.unsplash.com/premium_photo-1724654643848-ab19f6ec1c79?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    watchlist: ["M110", "M111", "M113", "M115"],
    likedMovies: ["M101", "M102", "M104"],
    createdAt: "2024-06-04T12:55:00Z",
  },
  {
    id: "U8",
    email: "digua@example.com",
    fullName: "Digua",
    username: "Digua",
    password: "passwordDigua123",
    profilePic: "https://imgs.699pic.com/images/601/354/628.jpg!list1x.v2",
    watchlist: ["M107", "M112", "M115"],
    likedMovies: ["M101", "M102", "M104"],
    createdAt: "2024-06-05T11:50:00Z",
  },
  {
    id: "U9",
    email: "test@example.com",
    fullName: "Test",
    username: "test",
    password: "passwordTest123",
    profilePic: "https://imgs.699pic.com/images/601/354/628.jpg!list1x.v2",
    watchlist: ["M114"],
    likedMovies: ["M101"],
    createdAt: "2024-06-05T11:57:00Z",
  },
  {
    id: "U10",
    email: "tree@example.com",
    fullName: "Tree",
    username: "tree",
    password: "passwordTree123",
    profilePic:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Larix_decidua_Aletschwald.jpg/220px-Larix_decidua_Aletschwald.jpg",
    watchlist: ["M110", "M115"],
    likedMovies: ["M104", "M106", "M108"],
    createdAt: "2024-06-05T12:30:00Z",
  },
];

export const movies = [
  {
    id: "M101",
    title: "Inception",
    year: 2010,
    genre: ["G15", "G17"], // Sci-Fi (G15), Thriller (G17)
    director: "Christopher Nolan",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    rating: 4.8,
    reviewCount: 1250,
    likes: 2000,
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg",
    trailerUrl:
      "https://www.youtube.com/watch?v=YoHD9XEInc0&pp=ygURaW5jZXB0aW9uIHRyYWlsZXI%3D",
    description: "A thief enters people's dreams to steal secrets.",
    duration: 148,
    releaseDate: "2010-07-16",
    region: "Hollywood",
  },
  {
    id: "M102",
    title: "Interstellar",
    year: 2014,
    genre: ["G15", "G2"], // Science Fiction (G15), Adventure (G2)
    director: "Christopher Nolan",
    actors: ["Matthew McConaughey", "Anne Hathaway"],
    rating: 4.9,
    reviewCount: 1500,
    likes: 2500,
    posterUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9oW0XQlu1lo1G_49M-YwGzKR6rUg-CtflZj07HfbT8d2GwKWg",
    trailerUrl:
      "https://www.youtube.com/watch?v=zSWdZVtXT7E&pp=ygUUaW50ZXJzdGVsbGFyIHRyYWlsZXI%3D",
    description: "Astronauts travel through a wormhole to save humanity.",
    duration: 169,
    releaseDate: "2014-11-07",
    region: "Hollywood",
  },
  {
    id: "M103",
    title: "Alien: Romulus",
    year: 2024,
    genre: ["G15", "G11"], // Science Fiction (G15), Horror (G11)
    director: "Fede Alvarez",
    actors: [
      "Cailee Spaeny",
      "David Jonsson",
      "Archie Renaux",
      "Isabela Merced",
      "Spike Fearn",
      "Aileen Wu",
    ],
    rating: 3.6,
    reviewCount: 1000,
    likes: 2000,
    posterUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQZ2CbXVyxxX0yZ6TnyEjoUCP7gZE84PODHF8w1ljHdrjIIj9w8",
    trailerUrl:
      "https://www.youtube.com/watch?v=OzY2r2JXsDM&pp=ygUVYWxpZW4gcm9tdWx1cyB0cmFpbGVy",
    description:
      "In space, no one can hear you. While scavenging the deep ends of a derelict space station, a group of young space colonizers come face to face with the most terrifying life form in the universe.",
    duration: 119,
    releaseDate: "2024-12-08",
    region: "Hollywood",
  },
  {
    id: "M104",
    title: "Alita Battle Angel",
    year: 2019,
    genre: ["G1", "G2", "G15"], // Action (G1), Adventure (G2), Science Fiction (G15)
    director: "Robert Rodriguez",
    actors: ["Rosa Salazar", "Christoph Waltz", "Jennifer Connelly"],
    rating: 4.6,
    reviewCount: 1050,
    likes: 2500,
    posterUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRhpDkgcs181Y4o47aLXEfu2ONfKde4A2UgwR-gy3Szuf_r_nmQ",
    trailerUrl:
      "https://www.youtube.com/watch?v=w7pYhpJaJW8&pp=ygUaYWxpdGEgYmF0dGxlIGFuZ2VsIHRyYWlsZXI%3D",
    description:
      "A deactivated cyborg's revived, but can't remember anything of her past and goes on a quest to find out who she is.",
    duration: 112,
    releaseDate: "2019-01-31",
    region: "Hollywood",
  },
  {
    id: "M105",
    title: "Avatar: The Way of Water",
    year: 2022,
    genre: ["G1", "G2", "G9"], // Action (G1), Adventure (G2), Fantasy (G9)
    director: "James Cameron",
    actors: ["Sam Worthington", "Zoe Saldana", "Kate Winslet"],
    rating: 4.7,
    reviewCount: 2000,
    likes: 3000,
    posterUrl:
      "https://lh4.googleusercontent.com/proxy/jTL6IVbQ8pwKvriiE3zj_ua7Dem8b6Tn5B06I82jPKSzpT8ZV0R34dOFqAIGFiB_wbC0BhOiE8lDN4qytsOHCmsE3pys6CKJhuuesBqgq1PM28HF",
    trailerUrl:
      "https://www.youtube.com/watch?v=d9MyW72ELq0&pp=ygUdYXZhdGFyIGEgd2F5IG9mIHdhdGVyIHRyYWlsZXI%3D",
    description:
      "Jake Sully and Ney'tiri have formed a family and are doing anything they can to stay together.",
    duration: 192,
    releaseDate: "2022-12-16",
    region: "Hollywood",
  },
  {
    id: "M106",
    title: "Flow",
    year: 2024,
    genre: ["G3", "G2", "G9", "G8"], // Animation (G3), Adventure (G2), Fantasy (G9), Family (G8)
    director: "Gints Zilbalodis",
    actors: [""],
    rating: 4.7,
    reviewCount: 992,
    likes: 1500,
    posterUrl:
      "https://upload.wikimedia.org/wikipedia/en/2/2d/Flow_movie_poster.jpg",
    trailerUrl:
      "https://www.youtube.com/watch?v=ZgZccxuj2RY&pp=ygUSZmxvdyBtb3ZpZSB0cmFpbGVy",
    description:
      "Cat is a solitary animal, but as its home is devastated by a great flood, he finds refuge on a boat populated by various species, and will have to team up with them despite their differences.",
    duration: 84,
    releaseDate: "2024-05-22",
    region: "Europe",
  },
  {
    id: "M107",
    title: "Parasite",
    year: 2019,
    genre: ["G17", "G7"], // Thriller (G17), Drama (G7)
    director: "Bong Joon-ho",
    actors: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    rating: 4.6,
    reviewCount: 1300,
    likes: 1800,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BYjk1Y2U4MjQtY2ZiNS00OWQyLWI3MmYtZWUwNmRjYWRiNWNhXkEyXkFqcGc@._V1_.jpg",
    trailerUrl:
      "https://www.youtube.com/watch?v=SEUXfv87Wpk&pp=ygUWcGFyYXNpdGUgbW92aWUgdHJhaWxlcg%3D%3D",
    description:
      "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    duration: 132,
    releaseDate: "2019-05-30",
    region: "South Korea",
  },
  {
    id: "M108",
    title: "Pearl",
    year: 2022,
    genre: ["G11", "G17"], // Horror (G11), Thriller (G17)
    director: "Ti West",
    actors: ["Mia Goth", "David Corenswet"],
    rating: 4.5,
    reviewCount: 800,
    likes: 1200,
    posterUrl:
      "https://m.media-amazon.com/images/M/MV5BNzk0Y2RlZjItZDUzYi00Y2JhLTk5MzMtNjgzYWFmZmUxN2FmXkEyXkFqcGc@._V1_.jpg",
    trailerUrl:
      "https://www.youtube.com/watch?v=L5PW5r3pEOg&pp=ygUTcGVhcmwgbW92aWUgdHJhaWxlcg%3D%3D",
    description:
      "Trapped on her family's isolated farm, Pearl must tend to her ailing father under the bitter and overbearing watch of her mother.",
    duration: 102,
    releaseDate: "2022-09-16",
    region: "USA"
  },
  {
    id: "M109",
    title: "Severence",
    year: 2022,
    genre: ["G7", "G17"], // Drama (G7), Thriller (G17)
    director: "Dan Erickson",
    actors: ["Adam Scott", "Zach Cherry", "Brit Lower"],
    rating: 4.8,
    reviewCount: 1500,
    likes: 2500,
    posterUrl:
      "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRAJR-R-_YwYS4bOJqLdz8fV73EW1uFB4fL4KlKmxdKDZhZXfGH",
    trailerUrl:
      "https://www.youtube.com/watch?v=xEQP4VVuyrY&pp=ygURc2V2ZXJhbmNlIHRyYWlsZXI%3D",
    description:
      "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    duration: 60,
    releaseDate: "2022-02-18",
    region: "Hollywood",
  },
  {
    id: "M110",
    title: "Stranger Things Season 3",
    year: 2019,
    genre: ["G7", "G9", "G11"], // Drama (G7), Fantasy (G9), Horror (G11)
    director: "The Duffer Brothers",
    actors: ["Winona Ryder", "David Harbour", "Finn Wolfhard"],
    rating: 4.7,
    reviewCount: 2000,
    likes: 3000,
    posterUrl: "https://example.com/stranger-things.jpg",
    trailerUrl:
      "https://www.youtube.com/watch?v=6Am4v0C_z8c&pp=ygUYc3RyYW5nZXIgdGhpbmdzIHNlYXNvbiAz",
    description:
      "A group of kids in a small town uncover a series of supernatural mysteries.",
    duration: 50,
    releaseDate: "2019-07-04",
    region: "Hollywood",
  },
  {
    id: "M111",
    title: "The George",
    year: 2024,
    genre: ["G1", "G15", "G14"], // Action (G1), Science Fiction (G15), Romance (G14)
    director: "Scott Derrickson",
    actors: ["Miles Teller", "Anya Taylor-Joy", "Sigourney Weaver"],
    rating: 4.5,
    reviewCount: 900,
    likes: 1300,
    posterUrl:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSBcutt8c7S-kokoBHXWNchEIJ76nASu7qcywamV6p9s8ofWfmc",
    trailerUrl:
      "https://www.youtube.com/watch?v=rUSdnuOLebE&pp=ygUSdGhlIGdlb3JnZSB0cmFpbGVy",
    description:
      "Two highly-trained operatives are appointed to posts in guard towers on opposite sides of a vast and highly classified gorge, protecting the world from a mysterious evil that lurks within. They work together to keep the secret in the gorge.",
    duration: 127,
    releaseDate: "2025-02-14",
    region: "Hollywood",
  },
  {
    id: "M112",
    title: "The Subtance",
    year: 2024,
    genre: ["G7", "G15", "G11"], // Drama (G7), Science Fiction (G15), Horror (G11)
    director: "Coralie Fargeat",
    actors: ["Demi Moore", "Margaret Qualley", "Dennis Quaid"],
    rating: 0,
    reviewCount: 0,
    likes: 0,
    posterUrl:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR16e_VsO0UR1jEkkDMPLjbOMKApHv-XASUcGLSkIEAUFu6LkvR",
    trailerUrl:
      "https://www.youtube.com/watch?v=LNlrGhBpYjc&pp=ygUVdGhlIHN1YnN0YW5jZSB0cmFpbGVy",
    description:
      "A fading celebrity takes a black-market drug: a cell-replicating substance that temporarily creates a younger, better version of herself.",
    duration: 141,
    releaseDate: "2024-09-20",
    region: "Hollywood",
  },
  {
    id: "M113",
    title: "When Life Gives You Tangerines",
    year: 2025,
    genre: ["G7", "G14"], // Drama (G7), Romance (G14)
    director: "Kim Woo-seok",
    actors: ["IU", "Park Bo-gum", "Moon So-ri", "Park Hae-joon"],
    rating: 0,
    reviewCount: 0,
    likes: 0,
    posterUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQbtpIGSyohv9SPRz799TqMvEi1CsmXRwO6Ft6KY0CvDe5doqXD",
    trailerUrl:
      "https://www.youtube.com/watch?v=4ECAaQkNAbc&pp=ygUmd2hlbiBsaWZlIGdpdmVzIHlvdSB0YW5nZXJpbmVzIHRyYWlsZXI%3D",
    description:
      "Beginning in Jeju in 1951, the spirited Ae-sun and the steadfast Gwan-sik's island story blossoms into a lifelong tale of setbacks and triumphs — proving love endures across time.",
    duration: 60,
    releaseDate: "2025-03-07",
    region: "South Korea",
  },
  {
    id: "M114",
    title: "A Minecraft Movie",
    year: 2025,
    genre: ["G1", "G2", "G4"], // Action (G1), Adventure (G2), Comedy (G4)
    director: "Jared Hess",
    actors: [
      "Jason Momoa",
      "Jack Black",
      "Danielle Brooks",
      "Emma Myers",
      "Sebastion Hansen",
    ],
    rating: 3.9,
    reviewCount: 1500,
    likes: 2100,
    posterUrl:
      "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQcBKTkcEyvgcRXxmE2aYz2bj2t0bDfuid9I8dySX12cv8RvPF-",
    trailerUrl:
      "https://www.youtube.com/watch?v=8B1EtVPBSMw&pp=ygUZYSBtaW5lY3JhZnQgbW92aWUgdHJhaWxlcg%3D%3D",
    description:
      "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
    duration: 101,
    releaseDate: "2025-03-31",
    region: "Hollywood",
  },
  {
    id: "M115",
    title: "Plankton: The Movie",
    year: 2025,
    genre: ["G2", "G3", "G4", "G8", "G9"], // Adventure (G2), Animation (G3), Comedy (G4), Family (G8), Fantasy (G9)
    director: "Dave Needham",
    actors: [""],
    rating: 3.9,
    reviewCount: 1000,
    likes: 2000,
    posterUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoTeAhF9MjfBqFF9Y5D31MZ8s_tT8iuef18F1416xkWnSl5vW9",
    trailerUrl:
      "https://www.youtube.com/watch?v=IHRScjhllsQ&pp=ygUacGxhbmt0b24gdGhlIG1vdmllIHRyYWlsZXI%3D",
    description:
      "When Karen the Computer decides to take over the world, it's up to Plankton to stop her - with a little help from SpongeBob and the Gal Pals (Pearl, Sandy, and Mrs. Puff).",
    duration: 84,
    releaseDate: "2025-03-07",
    region: "USA",
  },
];

export const reviews = [
  {
    id: "RW1",
    userId: "U1",
    movieId: "M103",
    rating: 5,
    review: "Amazing concept and execution!",
    createdAt: "2024-06-03T14:00:00Z",
  },
  {
    id: "RW2",
    userId: "U2",
    movieId: "M106",
    rating: 3,
    review: "Visually stunning, but a bit confusing.",
    createdAt: "2024-06-04T09:30:00Z",
  },
  {
    id: "RW3",
    userId: "U2",
    movieId: "M109",
    rating: 4,
    review:
      "A visually stunning film that keeps you hooked from start to finish. The pacing is tight, and the story is easy to follow yet emotionally impactful. Great for a weekend watch.",
    createdAt: "2024-06-04T010:30:00Z",
  },
  {
    id: "RW4",
    userId: "U2",
    movieId: "M110",
    rating: 3,
    review:
      "A decent movie with solid acting and some memorable scenes. The plot is predictable at times, but still enjoyable",
    createdAt: "2024-06-04T10:35:00Z",
  },
  {
    id: "RW5",
    userId: "U2",
    movieId: "M113",
    rating: 4,
    review:
      "Good background watch if you're not looking for anything too deep.",
    createdAt: "2024-06-04T10:45:00Z",
  },
  {
    id: "RW6",
    userId: "U2",
    movieId: "M106",
    rating: 3,
    review:
      " This film is a rollercoaster of emotions. Strong performances and beautiful cinematography make it stand out. It lingers in your mind long after the credits roll.",
    createdAt: "2024-06-04T10:46:00Z",
  },
  {
    id: "RW7",
    userId: "U2",
    movieId: "M101",
    rating: 3,
    review:
      "Not the most original story, but the charm and energy of the cast carry it through. A fun watch if you're in the mood for something light and entertaining.",
    createdAt: "2024-06-05T09:30:00Z",
  },
  {
    id: "RW8",
    userId: "U2",
    movieId: "M115",
    rating: 4,
    review:
      "The movie tries to do something different—and it works. Unique style, strong direction, and a story that leaves room for interpretation. Definitely worth a watch.",
    createdAt: "2024-06-05T10:30:00Z",
  },
  {
    id: "RW9",
    userId: "U2",
    movieId: "M112",
    rating: 5,
    review:
      "A well-made film with a good balance of story, emotion, and visuals. It keeps you engaged and leaves a lasting impression.",
    createdAt: "2024-06-06T09:30:00Z",
  },
  {
    id: "RW10",
    userId: "U2",
    movieId: "M107",
    rating: 3,
    review:
      "An average film that had potential, but didn’t fully deliver. Some strong moments, but overall forgettable.",
    createdAt: "2024-06-06T09:35:00Z",
  },
];

export const likes = [
  {
    userId: "U3",
    movieId: "M108",
    likedAt: "2024-06-02T10:15:00Z",
  },
  {
    userId: "U1",
    movieId: "M111",
    likedAt: "2024-06-03T12:30:00Z",
  },
  {
    userId: "U5",
    movieId: "M104",
    likedAt: "2024-06-04T09:00:00Z",
  },
  {
    userId: "U7", // Fixed: Added quotes around "L7" (was `L7` without quotes)
    movieId: "M110",
    likedAt: "2024-06-05T14:45:00Z",
  },
  {
    userId: "U1",
    movieId: "M103",
    likedAt: "2024-06-05T15:45:00Z",
  },
  {
    userId: "U2",
    movieId: "M101",
    likedAt: "2024-06-06T18:20:00Z",
  },
  {
    userId: "U2",
    movieId: "M115",
    likedAt: "2024-06-06T18:20:00Z",
  },
  {
    userId: "U6",
    movieId: "M101",
    likedAt: "2024-06-07T16:50:00Z",
  },
  {
    userId: "U9",
    movieId: "M107",
    likedAt: "2024-06-08T11:25:00Z",
  },
  {
    userId: "U8",
    movieId: "M102",
    likedAt: "2024-06-08T13:15:00Z",
  },
  {
    userId: "U4",
    movieId: "M113",
    likedAt: "2024-06-09T19:05:00Z",
  },
  {
    userId: "U10",
    movieId: "M106",
    likedAt: "2024-06-09T20:30:00Z",
  },
  {
    userId: "U2",
    movieId: "M109",
    likedAt: "2024-06-10T17:00:00Z",
  },
  {
    userId: "U1",
    movieId: "M112",
    likedAt: "2024-06-11T08:45:00Z",
  },
  {
    userId: "U3",
    movieId: "M103",
    likedAt: "2024-06-12T21:10:00Z",
  },
  {
    userId: "U5",
    movieId: "M114",
    likedAt: "2024-06-12T22:25:00Z",
  },
  {
    userId: "U7",
    movieId: "M105",
    likedAt: "2024-06-13T07:40:00Z",
  },
  {
    userId: "U6",
    movieId: "M111",
    likedAt: "2024-06-14T06:20:00Z",
  },
  {
    userId: "U9",
    movieId: "M103",
    likedAt: "2024-06-14T15:35:00Z",
  },
  {
    userId: "U10",
    movieId: "M110",
    likedAt: "2024-06-15T18:55:00Z",
  },
  {
    userId: "U4",
    movieId: "M101",
    likedAt: "2024-06-15T23:00:00Z",
  },
  {
    userId: "U8",
    movieId: "M115",
    likedAt: "2024-06-16T14:10:00Z",
  },
];

export const genres = [
  {
    id: "G1",
    name: "Action",
  },
  {
    id: "G2",
    name: "Adventure",
  },
  {
    id: "G3",
    name: "Animation",
  },
  {
    id: "G4",
    name: "Comedy",
  },
  {
    id: "G5",
    name: "Crime",
  },
  {
    id: "G6",
    name: "Documentary",
  },
  {
    id: "G7",
    name: "Drama",
  },
  {
    id: "G8",
    name: "Family",
  },
  {
    id: "G9",
    name: "Fantasy",
  },
  {
    id: "G10",
    name: "History",
  },
  {
    id: "G11",
    name: "Horror",
  },
  {
    id: "G12",
    name: "Music",
  },
  {
    id: "G13",
    name: "Mystery",
  },
  {
    id: "G14",
    name: "Romance",
  },
  {
    id: "G15",
    name: "Science Fiction",
  },
  {
    id: "G16",
    name: "TV Movie",
  },
  {
    id: "G17",
    name: "Thriller",
  },
  {
    id: "G18",
    name: "War",
  },
  {
    id: "G19",
    name: "Western",
  },
];
