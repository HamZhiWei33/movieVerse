import { BsBookmarkPlus, BsBookmarkPlusFill } from 'react-icons/bs';
import "../../styles/directory/InteractiveIcon.css";

const AddToWatchlistIcon = ({ addedToWatchlist = false, onClick }) => {
  return (
    <span
      className={`icon ${addedToWatchlist ? 'addedToWatchlist' : ''}`}
      onClick={onClick}
    >
      {addedToWatchlist ? <BsBookmarkPlusFill /> : <BsBookmarkPlus />}
    </span>
  );
};

export default AddToWatchlistIcon;