// not complete
// PIC TZW
const users = [
  {
    id: U1,
    email: "john.doe@example.com",
    fullName: "John Doe",
    username: "johndoe",
    password: "hashed_password_123",
    profilePic: "https://example.com/johndoe.jpg",
    watchlist: [101, 102], // Movie IDs
    likedMovies: [103],
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: U2,
    email: "jane.smith@example.com",
    fullName: "Jane Smith",
    username: "janesmith",
    password: "hashed_password_456",
    profilePic: "https://example.com/janesmith.jpg",
    watchlist: [104, 105],
    likedMovies: [101, 106],
    createdAt: "2024-06-02T12:30:00Z",
  },
];

const movies = [
  {
    id: M101,
    title: "Inception",
    year: 2010,
    genre: ["Sci-Fi", "Thriller"],
    director: "Christopher Nolan",
    actors: ["Leonardo DiCaprio", "Joseph Gordon-Levitt"],
    rating: 4.8,
    reviewCount: 1250,
    likes: 2000,
    posterUrl: "https://example.com/inception.jpg",
    trailerUrl: "https://youtube.com/inception-trailer",
    description: "A thief enters people's dreams to steal secrets.",
    duration: 148, // in minutes
    releaseDate: "2010-07-16",
  },
  {
    id: M102,
    title: "Interstellar",
    year: 2014,
    genre: ["Sci-Fi", "Adventure"],
    director: "Christopher Nolan",
    actors: ["Matthew McConaughey", "Anne Hathaway"],
    rating: 4.9,
    reviewCount: 1500,
    likes: 2500,
    posterUrl: "https://example.com/interstellar.jpg",
    trailerUrl: "https://youtube.com/interstellar-trailer",
    description: "Astronauts travel through a wormhole to save humanity.",
    duration: 169,
    releaseDate: "2014-11-07",
  },
];

const reviews = [
  {
    id: RW1,
    userId: 1,
    movieId: 101,
    rating: 5,
    review: "Amazing concept and execution!",
    createdAt: "2024-06-03T14:00:00Z",
  },
  {
    id: RW2,
    userId: 2,
    movieId: 102,
    rating: 4,
    review: "Visually stunning, but a bit confusing.",
    createdAt: "2024-06-04T09:30:00Z",
  },
];

const watchlists = [
  {
    userId: W1,
    movies: [101, 102],
  },
  {
    userId: W2,
    movies: [104, 105],
  },
];

const likes = [
  {
    userId: L1,
    movieId: 103,
    likedAt: "2024-06-05T15:45:00Z",
  },
  {
    userId: L2,
    movieId: 101,
    likedAt: "2024-06-06T18:20:00Z",
  },
];
