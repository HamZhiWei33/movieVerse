import * as React from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import "../../styles/directory/ReviewStars.css";

const ReviewStars = ({
  rating = 0,
  readOnly = true,
  showNumber = false,
  size = 'medium',
  alignRight = false,
  onChange
}) => {
  const [hover, setHover] = React.useState(-1);
  const [value, setValue] = React.useState(rating);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (onChange) {
      onChange(event, newValue);
    }
  };

  const formatRating = (num) => {
    if (num === 0) return "0";
    return Number.isInteger(num) ? `${num}.0` : num.toString();
  };

  React.useEffect(() => {
    setValue(rating);
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
          {hover !== -1
            ? formatRating(hover)
            : formatRating(value)}
        </span>
      )}
    </Box>
  );
};

export default ReviewStars;