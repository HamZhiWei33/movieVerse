import axios from "axios";
import Movie from "../models/movie.model.js";
import Genre from "../models/genre.model.js";
import dotenv from "dotenv";
dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fetches genres from TMDB and returns an object mapping id -> name.
 */
export const fetchGenresFromTMDB = async () => {
  try {
    const { data } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY,
        language: "en-US",
      },
    });

    const genres = data.genres;
    // Save or update genres in your database
    for (const genre of genres) {
      await Genre.updateOne(
        { id: genre.id },
        { $set: genre },
        { upsert: true }
      );
    }

    const genreMap = {};
    genres.forEach((g) => {
      genreMap[g.id] = g.name;
    });

    return genreMap;
  } catch (err) {
    console.error("Error fetching genres from TMDB:", err.message);
    return {};
  }
};

/**
 * Fetches popular movies from TMDB and stores them in the DB.
 */
export const fetchAndStorePopularMovies = async () => {
  try {
    const totalPages = 5; // Fetch 5 pages (100 movies)
    const genreMap = await fetchGenresFromTMDB();
    let totalMovies = 0;

    for (let page = 1; page <= totalPages; page++) {
      const { data } = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          language: "en-US",
          page: page,
        },
      });

      const movies = data.results;
      console.log(`📑 Processing page ${page} of ${totalPages}...`);

      for (const m of movies) {
        let region = "Unknown";
        let trailerUrl = "";
        let director = "Unknown";
        let actors = [];
        let duration = "0h 0min";

        try {
          // Get movie details including runtime
          const detailData = await axios.get(`${TMDB_BASE_URL}/movie/${m.id}`, {
            params: { api_key: TMDB_API_KEY },
          });

          // Format duration consistently
          const runtime = parseInt(detailData.data.runtime) || 0;
          const hours = Math.floor(runtime / 60);
          const minutes = runtime % 60;
          duration = `${hours}h ${minutes}min`;

          // Ensure genre IDs are integers
          const genreIds = detailData.data.genres
            .map((g) => parseInt(g.id))
            .filter((id) => !isNaN(id));

          try {
            //  Region
            const releaseData = await axios.get(
              `${TMDB_BASE_URL}/movie/${m.id}/release_dates`,
              {
                params: { api_key: TMDB_API_KEY },
              }
            );
            const results = releaseData.data.results;
            const primary =
              results.find((r) => r.iso_3166_1 === "US") || results[0];
            if (primary) region = primary.iso_3166_1;

            //  Trailer
            const videoData = await axios.get(
              `${TMDB_BASE_URL}/movie/${m.id}/videos`,
              {
                params: { api_key: TMDB_API_KEY },
              }
            );
            const trailer = videoData.data.results.find(
              (v) => v.site === "YouTube" && v.type === "Trailer"
            );
            if (trailer)
              trailerUrl = `https://www.youtube.com/watch?v=${trailer.key}`;

            //  Credits (director, actors)
            const creditData = await axios.get(
              `${TMDB_BASE_URL}/movie/${m.id}/credits`,
              {
                params: { api_key: TMDB_API_KEY },
              }
            );

            const crew = creditData.data.crew;
            const cast = creditData.data.cast;

            const directorObj = crew.find((p) => p.job === "Director");
            if (directorObj) director = directorObj.name;

            actors = cast.slice(0, 5).map((a) => a.name);
          } catch (err) {
            console.warn(
              `⚠️ TMDB detail fetch failed for ID ${m.id}: ${err.message}`
            );
          }

          await Movie.updateOne(
            { tmdbId: m.id },
            {
              tmdbId: m.id,
              title: m.title,
              year: new Date(m.release_date).getFullYear(),
              genre: genreIds, // Use the validated genre IDs
              director,
              actors,
              posterUrl: m.poster_path
                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                : "",
              trailerUrl,
              description: m.overview,
              duration: duration.trim(), // Ensure no extra spaces
              releaseDate: m.release_date,
              region,
            },
            { upsert: true }
          );

          console.log(
            `✓ Updated movie: ${m.title} with duration: ${duration} and genres: ${genreIds.join(
              ", "
            )}`
          );
        } catch (err) {
          console.error(`❌ Failed to update movie ${m.title}: ${err.message}`);
        }
      }

      totalMovies += movies.length;
      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`✅ Import completed! Updated ${totalMovies} movies`);
  } catch (error) {
    console.error("❌ TMDB Import Error:", error.message);
    throw error; // Re-throw to handle in calling code
  }
};
