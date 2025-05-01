import { users, movies, genres } from "../../constant";

export function getMovieObject(userId) {
  const watchlistIds =
    users.find((user) => user.id === userId)?.watchlist || [];
  // Get the movie objects from the watchlist
  const watchlistMovies = movies.filter((movie) =>
    watchlistIds.includes(movie.id)
  );

  console.log(watchlistMovies);

  return watchlistMovies;
}
