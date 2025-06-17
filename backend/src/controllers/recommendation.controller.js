import Movie from '../models/movie.model.js';
import Watchlist from '../models/watchlist.model.js';
import User from '../models/user.model.js';

export const getRecommendedMovies = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(400).json({ message: 'User ID is required' });

    // 获取用户基本信息
    const user = await User.findById(userId);
    const favouriteGenres = user?.favouriteGenres || []; // 用户注册时选的
    const genreSet = new Set(favouriteGenres.map(String));

    // 获取 watchlist 里的电影 genre
    const watchlist = await Watchlist.findOne({ userId }).populate('movies');
    if (watchlist) {
      for (const movie of watchlist.movies) {
        movie.genre.forEach(g => genreSet.add(String(g)));
      }
    }

    const combinedGenres = Array.from(genreSet);

    // 如果 genre 不够，fallback
    if (combinedGenres.length === 0) {
      const fallback = await Movie.find({ rating: { $gte: 3.5 } })
        .sort({ rating: -1, reviewCount: -1 })
        .limit(12);
      return res.status(200).json({ movies: fallback });
    }

    // 推荐逻辑：在这些 genre 中评分高的
    const recommendations = await Movie.find({
      genre: { $in: combinedGenres },
      rating: { $gte: 3.0 }
    })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(12);

    res.status(200).json({ movies: recommendations });
  } catch (error) {
    console.error('getRecommendedMovies error:', error.message);
    res.status(500).json({ message: 'Failed to fetch recommended movies' });
  }
};