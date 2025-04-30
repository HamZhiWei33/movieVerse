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
export function getGenreNamebyId(genderId) {
  const genre = genres.find((genre) => genre.id === genderId);
  return genre ? genre.name : "Unknown Genre";
}
export function convertDuration(duration) {
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}min`;
  }
}
