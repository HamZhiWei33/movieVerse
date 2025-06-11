import MovieCard from "../components/directory/MovieCard";
import MovieCardList from "../components/directory/MovieCardList";
import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigationType, useSearchParams, useLocation } from "react-router-dom";
import "../styles/directory.css";
import ViewDropdown from "../components/directory/ViewDropdown";
import { FaListUl } from "react-icons/fa";
import "../styles/sidebar.css";
import Sidebar from "../components/Sidebar";
import { fetchMovies, fetchFilterOptions } from "../services/movieService";
import usePreviousScrollStore from "../store/usePreviousScrollStore";

const DirectoryPage = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [regions, setRegions] = useState([]);
  const [years, setYears] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [addToWatchlistMovies, setAddToWatchlistMovies] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = searchParams.get("view") || "grid";
  const [view, setView] = useState(initialView);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { previousScrollPosition, clearScrollPosition } = usePreviousScrollStore();
  const navigationType = useNavigationType();
  const location = useLocation();
  const routeHistory = useRef([]);

  useEffect(() => {
    searchParams.set("view", view);
    setSearchParams(searchParams);
  }, [view]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch filters separately ONCE
        if (genres.length === 0 || regions.length === 0 || years.length === 0) {
          const filterOptions = await fetchFilterOptions();
          setGenres(filterOptions.genres);
          setRegions(filterOptions.regions);
          setYears(filterOptions.years);
        }

        // Send filters to backend
        const filters = {
          genres: selectedGenres.join(','),
          regions: selectedRegions.join(','),
          years: selectedYears.join(',')
        };

        // Fetch all movies at once (remove pagination parameters)
        const response = await fetchMovies(1, 1000, filters); // Large limit to get all movies
        setMovies(response.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenres, selectedRegions, selectedYears]);

  useEffect(() => {
  if (!loading && movies.length > 0 && previousScrollPosition > 0) {
    console.log("Restoring scroll to", previousScrollPosition);
    window.scrollTo(0, previousScrollPosition);

    // Clear the position after restoring to prevent reuse
    clearScrollPosition();
  }
}, [navigationType, movies, loading]);

  // Map genre IDs to names for filtering and display
  const genreMap = useMemo(() => {
    return genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  }, [genres]);

  // Map region codes to names for filtering and display
  const regionMap = useMemo(() => {
    return regions.reduce((map, region) => {
      map[region.code] = region.name;
      return map;
    }, {});
  }, [regions]);

  const toggleFilter = (value, selected, setSelected) => {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleLike = (id) => {
    setLikedMovies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleAddToWatchlist = (id) => {
    setAddToWatchlistMovies((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Filter movies by selected filters
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const genreName = movie.genre.map((id) => genreMap[id]);
      const regionName = regionMap[movie.region];

      const genreMatch =
        selectedGenres.length === 0 ||
        selectedGenres.some((g) => genreName.includes(g));
      const regionMatch =
        selectedRegions.length === 0 ||
        selectedRegions.includes(movie.region);
      const yearMatch =
        selectedYears.length === 0 ||
        selectedYears.some(year => year.toString() === movie.year.toString());

      return genreMatch && regionMatch && yearMatch;
    }).sort((a, b) => b.year - a.year); // Sort by year (descending)
  }, [movies, selectedGenres, selectedRegions, selectedYears, genreMap]);

  const renderButtons = (items, selected, setSelected) => (
    <div className="filter-group">
      {items.map((item, index) => {
        const label = item.label || item;
        const value = item.value || item;

        return (
          <button
            key={index}
            className={`filter-button ${selected.includes(value) ? "active" : ""}`}
            onClick={() => toggleFilter(value, selected, setSelected)}
            aria-pressed={selected.includes(value)}
          >
            {label}
          </button>
        );
      })}
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
        <div className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}>
          <Sidebar
            sections={[
              {
                id: "genre",
                title: "Genre",
                items: genres.map((g) => ({ label: g.name, value: g.name })),
                selected: selectedGenres,
                setSelected: setSelectedGenres,
              },
              {
                id: "region",
                title: "Region",
                items: regions.map((r) => ({ label: r.name, value: r.code })),
                selected: selectedRegions,
                setSelected: setSelectedRegions,
              },
              {
                id: "year",
                title: "Year",
                items: years.map((y) => ({ label: y, value: y })),
                selected: selectedYears,
                setSelected: setSelectedYears,
              },
            ]}
          />
        </div>
        {/* Overlay to close sidebar */}
        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar} aria-hidden="true"></div>
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
                  {renderButtons(genres.map(g => g.name), selectedGenres, setSelectedGenres)}
                </fieldset>
              </section>

              <section id="region">
                <fieldset>
                  <legend>Region</legend>
                  {renderButtons(regions.map(r => ({ label: r.name, value: r.code })), selectedRegions, setSelectedRegions)}
                </fieldset>
              </section>

              <section id="year">
                <fieldset>
                  <legend>Year</legend>
                  {renderButtons(years, selectedYears, setSelectedYears)}
                </fieldset>
              </section>

              <ViewDropdown view={view} setView={setView} />
            </section>
            {(selectedGenres.length > 0 || selectedRegions.length > 0 || selectedYears.length > 0) && (
              <div className="clear-filters-container">
                <button
                  className={`clear-filters-button ${
                    selectedGenres.length || selectedRegions.length || selectedYears.length
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
            {loading ? (
              <div className="loading-message">
                <p>Loading movies...</p>
              </div>
            ) : filteredMovies.length > 0 ? (
              view === "grid" ? (
                <div className="movie-grid">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={{
                        ...movie,
                        genre: movie.genre?.map(id => genreMap[id]) || [],
                        year: movie.year.toString(),
                      }}
                      liked={likedMovies.includes(movie.id)}
                      likeCount={movie.likeCount || 0}
                      addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                      onLike={() => toggleLike(movie.id)}
                      onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                      allReviews={reviews}
                    />
                  ))}
                </div>
              ) : (
                <div className="movie-list">
                  {filteredMovies.map((movie) => {
                    const genreNames = movie.genre?.map(id => genreMap[id]) || [];
                    const regionName = regionMap[movie.region] || movie.region;

                    const transformedMovie = {
                      ...movie,
                      year: movie.year.toString(),
                      genre: genreNames,
                      region: regionName,
                      director: movie.director,
                      actors: movie.actors,
                    };

                    return (
                      <MovieCardList
                        key={movie.id || movie._id}
                        movie={transformedMovie}
                        liked={likedMovies.includes(movie.id || movie._id)}
                        likeCount={movie.likeCount || 0}
                        addedToWatchlist={addToWatchlistMovies.includes(movie.id || movie._id)}
                        onLike={() => toggleLike(movie.id || movie._id)}
                        onAddToWatchlist={() => toggleAddToWatchlist(movie.id || movie._id)}
                        allReviews={reviews}
                      />
                    );
                  })}
                </div>
              )
            ) : (
              <div className="no-results">
                <p>No movies match your filters.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default DirectoryPage;