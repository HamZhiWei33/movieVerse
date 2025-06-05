import express from "express";
import Genre from "../models/genre.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find({});
    res.json(genres);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

export default router;
