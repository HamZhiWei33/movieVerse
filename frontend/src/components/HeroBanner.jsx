import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import "../styles/directory/HeroBanner.css";

const banners = [
  {
    title: "New Release: Alive",
    image: "./frontend/public/movie/stranger_things_season_3.pngg",
    description: "Check out the latest blockbuster!",
    className: "banner1",
    onClickTarget: "/directory" // First slide
  },
  {
    title: "Top Ranking: Parasite",
    image: "./frontend/public/movie/stranger_things_season_3.png",
    description: "Rank #1 Thriller Movie.",
    className: "banner2",
    onClickTarget: "/directory" // Second slide
  },
  {
    title: "See All Rankings",
    image: "./frontend/public/movie/stranger_things_season_3.png",
    description: "Explore the top movies now.",
    className: "banner3",
    onClickTarget: "/ranking" // Third slide
  },
  {
    title: "Justice Returns",
    image: "./frontend/public/movie/stranger_things_season_3.png",
    description: "Vengeance in the shadows.",
    className: "banner4",
    onClickTarget: null // Fourth slide
  }
];

export default function HeroBanner() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="hero-banner relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop={true}
        className="hero-swiper"
      >
        {banners.map((item, index) => (
          <SwiperSlide
            key={index}
            className={`hero-slide ${item.className}`}
            onClick={() => {
              if (item.onClickTarget) {
                navigate(item.onClickTarget);
              }
            }}
          >
            <div className="relative w-full h-[500px] cursor-pointer">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute left-10 bottom-20 text-white z-10">
                <h2 className="movieTitle">{item.title}</h2>
                <p className="movieDescription">{item.description}</p>
                <button className="watchNowButton">Explore</button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom arrows */}
        <div ref={prevRef} className="custom-prev select-none">←</div>
        <div ref={nextRef} className="custom-next select-none">→</div>
      </Swiper>
    </div>
  );
}
