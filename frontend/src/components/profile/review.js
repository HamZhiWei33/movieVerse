import { users } from "../../constant.js";
import { reviews } from "../../constant.js";
import { movies } from "../../constant.js";

export function getCurrentUserByUserId(userId) {
  const user = users.find((user) => user.id === userId);
  return user ? user : null;
}

export function getMovieNameById(movieId) {
  const movie = movies.find((movie) => movie.id === movieId);
  return movie ? movie.title : "Unknown Movie";
}
