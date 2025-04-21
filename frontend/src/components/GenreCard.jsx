// components/GenreCard.jsx
const GenreCard = ({ rank, image, title, rating }) => {
    const renderStars = (rating) => {
      const fullStars = Math.floor(rating);
      const halfStar = rating % 1 >= 0.5;
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      return (
        <>
          {"★".repeat(fullStars)}
          {halfStar && "½"}
          {"☆".repeat(emptyStars)}
        </>
      );
    };
  
    return (
      <div className="genre-card">
        <div className="genre-card-header">
          <h3>Top {rank}</h3>
          <div className="genre-rating-value">{rating.toFixed(1)}</div>
        </div>

        <div className="genre-card-body">
          <img src={image} alt={title} className="genre-poster"/>
          <div className="genre-info">
            <h4 className="genre-title">{title}</h4>
            <div className="rating-stars">{renderStars(rating)}</div>
            <div className="tags">
              <span className="badge">Genre</span>
              <span className="badge">Region</span>
              <span className="badge">Year</span>
            </div>
            <div className="duration-like">
              <span className="badge-duration">⏱ 8h 20min</span>
              <button className="icon-button">❤️</button>
              <button className="icon-button">📁</button>
            </div>
          </div>
        </div>     
      </div>
    );
  };
  
  export default GenreCard;
  