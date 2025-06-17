import { GoHeart, GoHeartFill } from 'react-icons/go';
import "../../styles/directory/InteractiveIcon.css";
import useMovieStore from "../../store/useMovieStore";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, useEffect, useMemo } from "react";

const LikeIcon = ({ movie, showCount = false }) => {
  const movieId = movie._id;

  const { fetchMovieLikes, likes, likeMovie, unlikeMovie } = useMovieStore();
  const { authUser, checkAuth } = useAuthStore();

  const [loadingLike, setLoadingLike] = useState(false);

  useEffect(() => {
    if (!authUser) {
      checkAuth();
    }
  }, [checkAuth]);

  useEffect(() => {
    fetchMovieLikes(movieId);
  }, [fetchMovieLikes]);

  const likeCount = useMemo(() => {
    return likes[movieId]?.likeCount ?? 0;
  }, [likes]);

  const liked = useMemo(() => {
    const item = likes[movieId];

    if (!authUser || !item) {
      return false;
    }

    if (typeof item.liked === 'boolean') {
      return item.liked;
    }

    return item.liked.some(like => like.userId === authUser._id);
  }, [likes]);

  const handleLikeClick = async (e) => {
    e.stopPropagation();
    if (loadingLike) return;

    setLoadingLike(true);
    try {
      if (liked) {
        await unlikeMovie(movieId);
      } else {
        await likeMovie(movieId);
      }
      await fetchMovieLikes(movieId);
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="iteractive-icon" onClick={handleLikeClick}>
      {/* <LikeIcon liked={liked} disabled={loadingLike} /> */}
      <span
        className={`icon ${liked ? 'liked' : ''}`}
      // onClick={onClick}
      >
        {liked ? <GoHeartFill /> : <GoHeart />}
      </span>
      <span className={`like-count ${!showCount && "hidden"}`}>{likeCount}</span>
    </div>
    // <span
    //   className={`icon ${liked ? 'liked' : ''}`}
    //   onClick={onClick}
    // >
    //   {liked ? <GoHeartFill /> : <GoHeart />}
    // </span>
  );
};

export default LikeIcon;
