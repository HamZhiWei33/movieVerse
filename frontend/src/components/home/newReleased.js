import { movies } from "../../constant";
// Get current date
const currentDate = new Date();

// Calculate date 6 months ago
const sixMonthsAgo = new Date(currentDate);
sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

// Filter movies released in the last 6 months
export const recentMovies = movies
  .filter((movie) => {
    const movieDate = new Date(movie.releaseDate);
    return movieDate >= sixMonthsAgo && movieDate <= currentDate;
  })
  .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));

console.log(recentMovies);
