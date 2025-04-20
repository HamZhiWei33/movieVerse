import { GoHeart, GoHeartFill } from 'react-icons/go';
import "../../styles/directory/InteractiveIcon.css";
// import 'movieVerse/frontend/src/styles/directory/LikeIcon.css';

const LikeIcon = ({ liked = false, onClick }) => {
  return (
    <span
      className={`icon ${liked ? 'liked' : ''}`}
      onClick={onClick}
    >
      {liked ? <GoHeartFill /> : <GoHeart />}
    </span>
  );
};

export default LikeIcon;
