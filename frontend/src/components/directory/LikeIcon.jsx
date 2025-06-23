import "../../styles/directory/InteractiveIcon.css";
import { useState, useEffect, useMemo } from "react";
import { GoHeart, GoHeartFill } from 'react-icons/go';
import { useAuthStore } from "../../store/useAuthStore";
import useMovieStore from "../../store/useMovieStore";

const LikeIcon = ({ movie, showCount = false }) => {
  const movieId = movie._id;

  const { fetchMovieLikes, likes, toggleLike } = useMovieStore();
  const { authUser } = useAuthStore();

  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    fetchMovieLikes(movieId);
  }, [fetchMovieLikes]);

  const liked = useMemo(() => {
    const item = likes[movieId];

    if (!authUser || !item) {
      return false;
    }

    return item.liked;
  }, [likes, movie]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      await toggleLike(movieId, !liked);
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="iteractive-icon" onClick={handleLikeClick}>
      <span className={`icon ${liked ? 'liked' : ''}`}>
        {liked ? <GoHeartFill /> : <GoHeart />}
      </span>
      <span className={`like-count ${!showCount && "hidden"}`}>{likes[movieId]?.likeCount ?? 0}</span>
    </div>
  );
};

export default LikeIcon;
