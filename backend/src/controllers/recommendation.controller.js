import Movie from '../models/movie.model.js';
import Watchlist from '../models/watchlist.model.js';

export const getRecommendedMovies = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    // Step 1: 找到该用户的 watchlist 记录
    const watchlist = await Watchlist.findOne({ userId }).populate('movies');
    if (!watchlist || watchlist.movies.length === 0) {
      // fallback：如果没有 watchlist，就推荐高评分热门电影
      const fallback = await Movie.find({ rating: { $gte: 3.5 } })
        .sort({ reviewCount: -1 })
        .limit(12);
      return res.status(200).json({ movies: fallback });
    }

    // Step 2: 收集 genre 偏好
    const genreCounts = {};
    for (const movie of watchlist.movies) {
      for (const g of movie.genre) {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      }
    }

    // 提取 top N 偏好 genre
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1]) // 按频率降序
      .slice(0, 3) // 可以控制看多少个主要偏好
      .map(([genreId]) => parseInt(genreId));

    // Step 3: 推荐电影（高评分 + 包含偏好 genre）
    const recommendations = await Movie.aggregate([
      {
        $match: {
          genre: { $in: topGenres },
          rating: { $gte: 3.5 },
          _id: { $nin: watchlist.movies.map((m) => m._id) }, // 排除已收藏的电影
        },
      },
      { $sample: { size: 12 } },
    ]);

    res.status(200).json({ movies: recommendations });
  } catch (error) {
    console.error('getRecommendedMovies error:', error.message);
    res.status(500).json({ message: 'Failed to fetch recommended movies' });
  }
};
