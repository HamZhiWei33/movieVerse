import "../../styles/directory/ReviewStars.css";
import { useState, useEffect } from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';

const ReviewStars = ({
  rating = 0,
  readOnly = true,
  showNumber = false,
  size = 'medium',
  onChange
}) => {
  const [hover, setHover] = useState(-1);
  const [value, setValue] = useState(Number(rating?.toFixed(1)));

  const handleChange = (event, newValue) => {
    if (newValue) {
      setValue(newValue);
    }
    if (onChange) {
      onChange(event, newValue);
    }
  };

  const formatRating = (num) => {
    if (num === 0) return "0";
    return Number.isInteger(num) ? `${num}.0` : num?.toString();
  };

  useEffect(() => {
      setValue(Number(rating?.toFixed(1)));
  }, [rating]);

  return (
    <Box className="review-stars-wrapper">
      <Rating
        name="movie-rating"
        value={value}
        precision={0.5}
        readOnly={readOnly}
        size={size}
        icon={<StarIcon style={{ color: '#CCFF00' }} fontSize="inherit" />}
        emptyIcon={<StarIcon style={{ color: '#999999' }} fontSize="inherit" />}
        onChange={handleChange}
        onChangeActive={(event, newHover) => {
          setHover(newHover);
        }}
      />
      {showNumber && (
        <span className="rating-number">
          {formatRating(hover !== -1 ? hover : value)}
        </span>
      )}
    </Box>
  );
};

export default ReviewStars;