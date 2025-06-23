import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../styles/home/HeroBanner.css";
import "../../styles/home.css";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { banners } from "./banner";

export default function HeroBanner() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const navigate = useNavigate();

  return (
    <div
      className="hero-banner"
      role="region"
      aria-label="Featured movie highlights"
    >
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
            role={item.onClickTarget ? "button" : undefined}
            tabIndex={item.onClickTarget ? 0 : -1}
            aria-label={
              item.onClickTarget ? `Explore ${item.title}` : undefined
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && item.onClickTarget) {
                navigate(item.onClickTarget);
              }
            }}
          >
            <div className="home-swiper-container">
              <img
                src={item.image}
                alt={item.title}
                className="home-swiper-image"
              />
              <div className="hero-details-wrapper">
                <div className="hero-content-overlay">
                  <h2 className="movieTitle">{item.title}</h2>
                  <p className="movieDescription">{item.description}</p>
                  <button className="watchNowButton">Explore</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom arrows */}
        <div
          ref={prevRef}
          className="custom-prev select-none"
          role="button"
          aria-label="Previous slide"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") prevRef.current?.click();
          }}
        >
          <span className="arrow" aria-hidden="true">
            ←
          </span>
        </div>

        <div
          ref={nextRef}
          className="custom-next select-none"
          role="button"
          aria-label="Next slide"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") nextRef.current?.click();
          }}
        >
          <span className="arrow" aria-hidden="true">
            →
          </span>
        </div>
      </Swiper>
    </div>
  );
}
