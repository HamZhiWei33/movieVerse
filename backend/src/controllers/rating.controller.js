import Movie from "../models/movie.model.js";
import Review from "../models/review.model.js";
import Genre from "../models/genre.model.js";

export const getRankingData = async (req, res) => {
  try {
    // Get movies with their ratings - add trailerUrl to selection
    const movies = await Movie.find({})
      .select(
        "title posterUrl image rating year genre description region duration trailerUrl"
      )
      .sort({ rating: -1 })
      .lean();

    // Debug: Check what image fields we have
    console.log("🔍 Backend Debug - First movie:", {
      title: movies[0]?.title,
      posterUrl: movies[0]?.posterUrl,
      image: movies[0]?.image,
      hasImage: !!(movies[0]?.posterUrl || movies[0]?.image)
    });

    // Get all reviews
    const reviews = await Review.find({})
      .select("movieId rating review")
      .lean();

    // Get all genres with proper fields
    const genres = await Genre.find({})
      .select("id name _id")
      .sort({ name: 1 })
      .lean();

    console.log("Fetched genres ranking:", genres);
    console.log(`Fetched ${movies.length} movies, ${reviews.length} reviews`);

    res.status(200).json({
      movies,
      reviews,
      genres,
    });
  } catch (error) {
    console.error("Error fetching ranking data:", error);
    res.status(500).json({ message: "Error fetching ranking data" });
  }
};