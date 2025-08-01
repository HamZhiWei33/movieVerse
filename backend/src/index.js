import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import rankingRoutes from "./routes/ranking.routes.js";
import userRoutes from "./routes/user.route.js";
import genreRoutes from "./routes/genre.route.js";
import likeRoutes from "./routes/like.route.js";
import movieRoutes from "./routes/movie.route.js";
import reviewRoutes from "./routes/review.route.js";
import cors from "cors";
import { updateAllMovies } from "./lib/movieUpdater.js";
// import { fetchAndStorePopularMovies } from "./lib/tmdb.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware - extracting data from the request body
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.listen(PORT, async () => {
  console.log("Server is running on port:" + PORT);
  await connectDB();
  await updateAllMovies().catch(err => {
    console.error("Failed to update movies:", err);
  });
  // await fetchAndStorePopularMovies(); // Fetch TMDB data
});
