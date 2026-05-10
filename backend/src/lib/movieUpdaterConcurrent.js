import Movie from "../models/movie.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function mapWithConcurrency(items, limit, mapper) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => mapper(item));
    results.push(p);

    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }

  return Promise.all(results);
}

export async function updateAllMovies() {
  try {
    console.log("Starting movie update process...");

    const movies = await Movie.find({}).lean();
    console.log(`Found ${movies.length} movies to update`);

    const start = new Date();
    const bulkOps = [];
    const movieChanges = {};
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    const fieldsToCompare = [
      "title",
      "year",
      "posterUrl",
      "trailerUrl",
      "description",
      "releaseDate",
      "region",
    ];

    await mapWithConcurrency(movies, 20, async (movie) => {
      try {
        if (!movie.tmdbId) {
          console.log(`Skipping ${movie.title} (no TMDB ID)`);
          skippedCount++;
          return;
        }

        const [movieDetails, videos] = await Promise.all([
          axios.get(`${TMDB_BASE_URL}/movie/${movie.tmdbId}`, {
            params: { api_key: TMDB_API_KEY }
          }),
          axios.get(`${TMDB_BASE_URL}/movie/${movie.tmdbId}/videos`, {
            params: { api_key: TMDB_API_KEY }
          })
        ]);

        const details = movieDetails.data;
        const videoData = videos.data;

        const trailer = videoData.results.find(
          v => v.site === "YouTube" && v.type === "Trailer" && v.iso_639_1 === "en"
        );

        const updateData = {
          title: details.title || movie.title,
          year: new Date(details.release_date).getFullYear() || movie.year,
          posterUrl: details.poster_path
            ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
            : movie.posterUrl,
          trailerUrl: trailer
            ? `https://www.youtube.com/watch?v=${trailer.key}`
            : movie.trailerUrl,
          description: details.overview || movie.description,
          releaseDate: details.release_date || movie.releaseDate,
          region: details.production_countries?.[0]?.iso_3166_1 || movie.region,
        };

        // Compare old and new values
        let changesDetected = false;
        const changes = [];
        const $set = {};

        for (const key of fieldsToCompare) {
          const oldValue = movie[key];
          const newValue = updateData[key];

          let comparableOld = oldValue;
          let comparableNew = newValue;

          if (key === 'releaseDate') {
            comparableOld = oldValue ? new Date(oldValue).toISOString().split('T')[0] : null;
            comparableNew = newValue ? new Date(newValue).toISOString().split('T')[0] : null;
          }

          if (JSON.stringify(comparableNew) !== JSON.stringify(comparableOld)) {
            changes.push(`${key}: ${oldValue} → ${newValue}`);
            changesDetected = true;
            $set[key] = newValue;
          }
        }

        if (changesDetected) {
          bulkOps.push({
            updateOne: {
              filter: { _id: movie._id },
              update: {
                $set: {
                  ...$set,
                  lastUpdated: new Date(),
                },
              },
            },
          });
          movieChanges[movie.title] = changes;
        }

      } catch (error) {
        console.error(`❌ Error updating movie ${movie.title}:`, error.message);
        errorCount++;
      }
    });

    if (bulkOps.length > 0) {
      const result = await Movie.bulkWrite(bulkOps);
      updatedCount = result.modifiedCount;
      Object.entries(movieChanges).forEach(([title, changes]) => {
        console.log(`Changes for ${title}:`);
        console.log(`  - ${changes.join('\n  - ')}`);
      });
    }

    await Movie.updateMany({}, { $set: { lastUpdated: new Date() } });

    console.log(`\nUpdate process completed:
    - Total movies processed: ${movies.length}
    - Movies updated: ${updatedCount}
    - Movies skipped (no TMDB ID): ${skippedCount}
    - Errors encountered: ${errorCount}
    - Total time taken: ${((new Date() - start) / 1000).toFixed(2)} seconds`);

  } catch (error) {
    console.error("❌ Critical error in movie update process:", error.message);
  }
}