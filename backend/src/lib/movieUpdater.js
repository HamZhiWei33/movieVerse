import Movie from "../models/movie.model.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function updateAllMovies() {
  try {
    console.log("Starting movie update process...");
    
    const movies = await Movie.find({}).lean();
    console.log(`Found ${movies.length} movies to update`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const movie of movies) {
      try {
        if (!movie.tmdbId) {
          console.log(`Skipping ${movie.title} (no TMDB ID)`);
          skippedCount++;
          continue;
        }

        console.log(`\nChecking for updates: ${movie.title} (TMDB ID: ${movie.tmdbId})`);

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

        // Get current date for lastUpdated
        const currentDate = new Date();
        
        // Prepare update data
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
          lastUpdated: currentDate // Always set to current date
        };

        // Compare old and new values
        let changesDetected = false;
        const changes = [];
        const fieldsToCompare = ['title', 'year', 'posterUrl', 'trailerUrl', 'description', 'releaseDate', 'region'];

        for (const key of fieldsToCompare) {
          const oldValue = movie[key];
          const newValue = updateData[key];
          
          if (key === 'releaseDate') {
            const oldDate = oldValue ? new Date(oldValue).toISOString().split('T')[0] : null;
            const newDate = newValue ? new Date(newValue).toISOString().split('T')[0] : null;
            if (oldDate !== newDate) {
              changes.push(`${key}: ${oldDate} → ${newDate}`);
              changesDetected = true;
            }
          } 
          else if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
            changes.push(`${key}: ${oldValue} → ${newValue}`);
            changesDetected = true;
          }
        }

        if (changesDetected) {
          console.log(`Changes detected for ${movie.title}:`);
          changes.forEach(change => console.log(`  - ${change}`));
          
          await Movie.findByIdAndUpdate(movie._id, updateData);
          console.log(`✅ Updated: ${movie.title}`);
          updatedCount++;
        } else {
          // Still update lastUpdated even if no other changes
          await Movie.findByIdAndUpdate(movie._id, { lastUpdated: currentDate });
          console.log(`⏩ No content changes for ${movie.title}, updated lastUpdated only.`);
          updatedCount++;
        }

      } catch (error) {
        console.error(`❌ Error updating movie ${movie.title}:`, error.message);
        errorCount++;
      }
    }

    console.log(`\nUpdate process completed:
    - Total movies processed: ${movies.length}
    - Movies updated: ${updatedCount}
    - Movies skipped (no TMDB ID): ${skippedCount}
    - Errors encountered: ${errorCount}`);

  } catch (error) {
    console.error("❌ Critical error in movie update process:", error);
  }
}