// PIC directoryPage
// please make like and add to watchlist icons reusable
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";

const InteractiveIcon = ({ icon, onClick }) => {
  return (
    <div className="interactive-icon" onClick={onClick}>
      {icon}
      <FaHeart />
      <FaRegHeart color="red" />
    </div>
  );
};
export default InteractiveIcon;
