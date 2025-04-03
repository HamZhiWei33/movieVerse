// PIC HomePage
// please make the star rating reusable
const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => {
    return (
      <span key={index} className={`star ${index < rating ? "filled" : ""}`}>
        ★
      </span>
    );
  });

  return <div className="star-rating">{stars}</div>;
};
export default StarRating;
