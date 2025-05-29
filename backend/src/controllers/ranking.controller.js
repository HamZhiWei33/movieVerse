import Movie from '../models/movie.model.js';
import Review from '../models/review.model.js';
import Genre from '../models/genre.model.js';

export const getRankingData = async (req, res) => {
    try {
        // Get movies with their ratings - add trailerUrl to selection
        const movies = await Movie.find({})
            .select('title posterUrl rating year genre description region duration trailerUrl')
            .sort({ rating: -1 })
            .lean();

        // Get all reviews
        const reviews = await Review.find({})
            .select('movieId rating review')
            .lean();

        // Get all genres with proper fields
        const genres = await Genre.find({})
            .select('id name')
            .sort({ name: 1 })  // Sort alphabetically
            .lean();

        console.log('Fetched genres:', genres); // Debug log

        res.status(200).json({
            movies,
            reviews,
            genres
        });

    } catch (error) {
        console.error('Error fetching ranking data:', error);
        res.status(500).json({ message: 'Error fetching ranking data' });
    }
};

export const getGenreRankings = async (req, res) => {
  try {
    const { genre } = req.query;
    
    // Get the genre ID from the genre name
    const genreObj = await Genre.findOne({ name: genre });
    
    // Build query based on genre filter
    const query = genre && genre !== 'All' 
      ? { 'genre': genreObj ? genreObj.id : -1 }  // Use -1 if genre not found
      : {};

    // Get movies with their ratings
    const movies = await Movie.find(query)
      .select('title posterUrl rating year genre description region duration _id')
      .lean();

    // Get all reviews for rating calculation
    const reviews = await Review.find({
      movieId: { $in: movies.map(m => m._id) }
    }).lean();

    // Get all genres for mapping
    const genres = await Genre.find({})
      .select('id name')
      .lean();

    res.status(200).json({
      movies,
      reviews,
      genres
    });

  } catch (error) {
    console.error('Error fetching genre rankings:', error);
    res.status(500).json({ message: 'Error fetching genre rankings' });
  }
};

export const getTopMovies = async (req, res) => {
  try {
    const movies = await Movie.find({})
      .select('title posterUrl rating year genre description region duration trailerUrl')
      .sort({ rating: -1 })
      .limit(10)
      .lean();

    const reviews = await Review.find({
      movieId: { $in: movies.map(m => m._id) }
    }).lean();

    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching top movies:', error);
    res.status(500).json({ message: 'Error fetching top movies' });
  }
};

export const updateMovieLike = async (req, res) => {
  try {
    const { id } = req.params;
    // Add your like logic here
    res.status(200).json({ message: 'Like status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating like status' });
  }
};

export const updateMovieWatchlist = async (req, res) => {
  try {
    const { id } = req.params;
    // Add your watchlist logic here
    res.status(200).json({ message: 'Watchlist status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating watchlist status' });
  }
};