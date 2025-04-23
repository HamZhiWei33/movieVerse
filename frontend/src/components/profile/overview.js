import { movies, genres, likes, reviews, users } from "../../constant.js";

export function getLikesObject(userId) {
  const genreCount = {};

  // Get all likes for the current user
  const userLikes = likes.filter((like) => like.userId === userId);

  // For each liked movie, count its genres
  userLikes.forEach((like) => {
    const movie = movies.find((movie) => movie.id === like.movieId);
    if (!movie) return;

    movie.genre.forEach((genreId) => {
      const genre = genres.find((g) => g.id === genreId);
      if (!genre) return;

      genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
    });
  });

  // Convert to array format
  return Object.entries(genreCount).map(([genre, count]) => ({
    genre,
    count,
  }));
}

export function getRatesObject(userId) {
  const genreCount = {};

  // Get all rated movie by the current user
  const userRatesMovie = reviews.filter((review) => review.userId === userId);

  // For each review movie, count its genres
  userRatesMovie.forEach((ratedMovie) => {
    const movie = movies.find((movie) => movie.id === ratedMovie.movieId);
    if (!movie) return;

    movie.genre.forEach((genreId) => {
      const genre = genres.find((g) => g.id === genreId);
      if (!genre) return;

      genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
    });
  });

  // Convert to array format
  return Object.entries(genreCount).map(([genre, count]) => ({
    genre,
    count,
  }));
}

export function getWatchlistObject(userId) {
  const genreCount = {};

  // Get current user
  const user = users.find((user) => user.id === userId);
  if (!user) return [];

  // Go through each movie in the watchlist
  user.watchlist.forEach((movieId) => {
    const movie = movies.find((movie) => movie.id === movieId);
    if (!movie) return;

    // Count each genre
    movie.genre.forEach((genreId) => {
      const genre = genres.find((g) => g.id === genreId);
      if (!genre) return;

      genreCount[genre.name] = (genreCount[genre.name] || 0) + 1;
    });
  });

  // Convert to array format
  return Object.entries(genreCount).map(([genre, count]) => ({
    genre,
    count,
  }));
}
