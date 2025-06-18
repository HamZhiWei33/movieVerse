export const getTopMoviesByGenre = (movies, allGenres, limit = 6) => {
  const result = {
    All: [],
  };

  // Sort all movies first
  const allMoviesSorted = [...movies]
    .map((movie) => ({
      ...movie,
      compositeScore: movie.rating * 0.8 + (movie.year - 2000) * 0.02,
    }))
    .sort((a, b) => b.compositeScore - a.compositeScore);

  result.All = allMoviesSorted.slice(0, limit);

  // Sort by each genre
  allGenres.forEach((genre) => {
    const genreMovies = movies.filter((m) => m.genre.includes(Number(genre.id)));

    const sorted = [...genreMovies]
      .map((movie) => ({
        ...movie,
        compositeScore: movie.rating * 0.8 + (movie.year - 2000) * 0.02,
      }))
      .sort((a, b) => b.compositeScore - a.compositeScore);

    result[genre.name] = sorted.slice(0, limit);
  });

  return result;
};
