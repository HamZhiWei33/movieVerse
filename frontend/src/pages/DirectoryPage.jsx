import MovieCard from "../components/directory/MovieCard";
import MovieCardList from "../components/directory/MovieCardList";
import { useState, useMemo } from "react";
import "../styles/directory.css";
import ViewDropdown from "../components/directory/ViewDropdown";

const genres = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Thriller",
  "Sci-Fi",
  "Fantasy",
  "Romance",
  "Mystery",
  "Crime",
  "Animation",
];

const regions = [
  "Hollywood",
  "Bollywood",
  "Nollywood",
  "China",
  "Japan",
  "South Korea",
  "Europe",
  "Latin America",
  "Middle East",
];

const years = [
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2010s",
  "2000s",
  "1990s",
  "1980s",
  "1970s",
  "1960s",
];

const movies = [
  {
    title: "Stranger Things Season 3",
    img: "/movie/stranger_things_season_3.png",
    genre: ["Sci-Fi", "Mystery", "Adventure", "Drama"],
    region: "Hollywood",
    year: "2019",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Parasite",
    img: "/movie/parasite.png",
    genre: ["Horror", "Crime"],
    region: "South Korea",
    year: "2019",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Avatar: The Way of Water",
    img: "/movie/avatar_the_way_of_water.png",
    genre: ["Action", "Adventure", "Sci-Fi"],
    region: "Hollywood",
    year: "2022",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Alita: Battle Angel",
    img: "/movie/alita_battle_angel.png",
    genre: ["Action", "Sci-Fi", "Adventure"],
    region: "Hollywood",
    year: "2019",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Alien",
    img: "/movie/alien.png",
    genre: ["Horror", "Sci-Fi", "Thriller"],
    region: "Hollywood",
    year: "1979",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "The Gorge",
    img: "/movie/the_gorge.png",
    genre: ["Thriller", "Romance", "Action"],
    region: "Hollywood",
    year: "2024",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Severance",
    img: "/movie/severance.png",
    genre: ["Mystery", "Drama", "Sci-Fi"],
    region: "Hollywood",
    year: "2022",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "When Life Gives You Tangerines",
    img: "/movie/when_life_gives_you_tangerines.png",
    genre: ["Romance", "Drama"],
    region: "South Korea",
    year: "2025",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Flow",
    img: "/movie/flow.png",
    genre: ["Fantasy", "Adventure", "Animation"],
    region: "Europe",
    year: "2024",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "The Substance",
    img: "/movie/the_substance.png",
    genre: ["Horror", "Drama", "Mystery"],
    region: "Europe",
    year: "2024",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Pearl",
    img: "/movie/pearl.png",
    genre: ["Horror", "Drama", "Thriller"],
    region: "Hollywood",
    year: "2022",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
  {
    title: "Stranger Things Season 4",
    img: "/movie/stranger_things_season_4.png",
    genre: ["Sci-Fi", "Mystery", "Thriller", "Romance", "Horror", "Drama"],
    region: "Hollywood",
    year: "2023",
    rating: 4.5,
    duration: "8h 30min",
    description:
      "Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. Hic eius animi ut distinctio architecto id neque dolor sit tempore voluptatem. Et cupiditate iure et internos porro est quos amet ut unde odit non aperiam earum. Et sunt nemo non suscipit quaerat et aperiam omnis ut autem excepturi.Lorem ipsum dolor sit amet. Est deleniti eaque ut dolores culpa et recusandae nulla qui voluptas delectus ab provident voluptas est quibusdam quos. ",
  },
];

const DirectoryPage = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);
  const [view, setView] = useState("grid");

  const toggleFilter = (value, selected, setSelected) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleLike = (title) => {
    setLikedMovies((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const toggleAddToWatchlist = (title) => {
    setAddToWatchlistMovies((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const genreMatch =
        selectedGenres.length === 0 ||
        selectedGenres.some((g) => movie.genre.includes(g));
      const regionMatch =
        selectedRegions.length === 0 || selectedRegions.includes(movie.region);
      const yearMatch =
        selectedYears.length === 0 || selectedYears.includes(movie.year);
      return genreMatch && regionMatch && yearMatch;
    });
  }, [selectedGenres, selectedRegions, selectedYears]);

  const renderButtons = (items, selected, setSelected, label) => (
    <div className="filter-group">
      {items.map((item, index) => (
        <button
          key={index}
          className={`filter-button ${selected.includes(item) ? "active" : ""}`}
          onClick={() => toggleFilter(item, selected, setSelected)}
          aria-pressed={selected.includes(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <main className="directory-page">
      <div className="top-bar">
        <div className="directory-header">
          <h2>Directory</h2>
        </div>
        <section className="filters">
          <fieldset>
            <legend>Genre</legend>
            {renderButtons(genres, selectedGenres, setSelectedGenres)}
          </fieldset>

          <fieldset>
            <legend>Region</legend>
            {renderButtons(regions, selectedRegions, setSelectedRegions)}
          </fieldset>

          <fieldset>
            <legend>Year</legend>
            {renderButtons(years, selectedYears, setSelectedYears)}
          </fieldset>
          <ViewDropdown setView={setView} />
        </section>
        {(selectedGenres.length > 0 ||
          selectedRegions.length > 0 ||
          selectedYears.length > 0) && (
          <div className="clear-filters-container">
            <button
              className={`clear-filters-button ${
                selectedGenres.length ||
                selectedRegions.length ||
                selectedYears.length
                  ? "active"
                  : ""
              }`}
              onClick={() => {
                setSelectedGenres([]);
                setSelectedRegions([]);
                setSelectedYears([]);
              }}
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <section className={`movie-container ${view}`}>
        {filteredMovies.length > 0 ? (
          view === "grid" ? (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.title}
                  movie={movie}
                  liked={likedMovies.includes(movie.title)}
                  addedToWatchlist={addToWatchlistMovies.includes(movie.title)}
                  onLike={() => toggleLike(movie.title)}
                  onAddToWatchlist={() => toggleAddToWatchlist(movie.title)}
                />
              ))}
            </div>
          ) : (
            <div className="movie-list">
              {filteredMovies.map((movie) => (
                <MovieCardList
                  key={movie.title}
                  movie={movie}
                  liked={likedMovies.includes(movie.title)}
                  addedToWatchlist={addToWatchlistMovies.includes(movie.title)}
                  onLike={() => toggleLike(movie.title)}
                  onAddToWatchlist={() => toggleAddToWatchlist(movie.title)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="no-results">
            <p>No movies match your filters. </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default DirectoryPage;
