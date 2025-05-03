import MovieCard from "../components/directory/MovieCard";
import MovieCardList from "../components/directory/MovieCardList";
import { useState, useMemo } from "react";
import "../styles/directory.css";
import ViewDropdown from "../components/directory/ViewDropdown";
import { FaListUl } from "react-icons/fa";
import "../styles/sidebar.css";
import Sidebar from "../components/Sidebar";
import { movies as movieData, genres as genreData } from "../constant"

// Extract unique regions from movie data
const regions = [...new Set(movieData.map(movie => movie.region))];

// Extract unique years from movie data
const years = [...new Set(movieData.map(movie => movie.year.toString()))];

// Map genre IDs to names
const genreMap = genreData.reduce((map, genre) => {
  map[genre.id] = genre.name;
  return map;
}, {});

// Get genre names for display
const genres = genreData.map(genre => genre.name);

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
    return movieData.filter((movie) => {
      // Convert genre IDs to names for filtering
      const movieGenreNames = movie.genre.map(id => genreMap[id]);

      const genreMatch =
        selectedGenres.length === 0 ||
        selectedGenres.some((g) => movieGenreNames.includes(g));
      const regionMatch =
        selectedRegions.length === 0 || selectedRegions.includes(movie.region);
      const yearMatch =
        selectedYears.length === 0 || selectedYears.includes(movie.year.toString());
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <main className="directory-page">
      <div id="toggle-sidebar-container">
        <button onClick={toggleSidebar}>
          <span>
            <FaListUl id="sidebar-icon" />
          </span>
        </button>
      </div>
      <div className="layout-container">
        {/* Sidebar with toggle functionality */}
        <div
          className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}
        >
          <Sidebar
            sections={[
              { id: "genre", title: "Genre" },
              { id: "region", title: "Region" },
              { id: "year", title: "Year" },
            ]}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            selectedYears={selectedYears}
            setSelectedYears={setSelectedYears}
            genres={genres}
            regions={regions}
            years={years}
          />
        </div>
        {/* Overlay to close sidebar */}
        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={toggleSidebar}
            aria-hidden="true"
          ></div>
        )}
        {/* Main content area */}
        <div className="content-area">
          <div className="top-bar">
            <div className="directory-header">
              <h2>Directory</h2>
            </div>
            <section className="filters">
              <section id="genre">
                <fieldset>
                  <legend>Genre</legend>
                  {renderButtons(genres, selectedGenres, setSelectedGenres)}
                </fieldset>
              </section>

              <section id="region">
                <fieldset>
                  <legend>Region</legend>
                  {renderButtons(regions, selectedRegions, setSelectedRegions)}
                </fieldset>
              </section>

              <section id="year">
                <fieldset>
                  <legend>Year</legend>
                  {renderButtons(years, selectedYears, setSelectedYears)}
                </fieldset>
              </section>

              <ViewDropdown setView={setView} />
            </section>
            {(selectedGenres.length > 0 ||
              selectedRegions.length > 0 ||
              selectedYears.length > 0) && (
                <div className="clear-filters-container">
                  <button
                    className={`clear-filters-button ${selectedGenres.length ||
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
                      key={movie.id}
                      movie={{
                        ...movie,
                        genre: movie.genre.map(id => genreMap[id]), // Convert genre IDs to names
                        year: movie.year.toString() // Ensure year is string
                      }}
                      liked={likedMovies.includes(movie.id)}
                      addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                      onLike={() => toggleLike(movie.id)}
                      onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="movie-list">
                  {filteredMovies.map((movie) => (
                    <MovieCardList
                      key={movie.id}
                      movie={{
                        ...movie,
                        genre: movie.genre.map(id => genreMap[id]), // Convert genre IDs to names
                        year: movie.year.toString() // Ensure year is string
                      }}
                      liked={likedMovies.includes(movie.id)}
                      addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                      onLike={() => toggleLike(movie.id)}
                      onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
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
        </div>
      </div>
    </main>
  );
};

export default DirectoryPage;
