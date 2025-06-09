import MovieCard from "../components/directory/MovieCard";
import MovieCardList from "../components/directory/MovieCardList";
import { useEffect, useState, useMemo } from "react";
import "../styles/directory.css";
import ViewDropdown from "../components/directory/ViewDropdown";
import { FaListUl } from "react-icons/fa";
import "../styles/sidebar.css";
import Sidebar from "../components/Sidebar";
// import { movies as movieData, genres as genreData, reviews } from "../constant";
import {
  fetchMovies,
  fetchGenres,
  fetchReviews,
  fetchFilterOptions,
} from "../services/movieService";

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
  const [view, setView] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const MOVIES_PER_PAGE = 100;


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

        const response = await fetchMovies(currentPage, MOVIES_PER_PAGE, filters);

        setMovies(response.data);
        setTotalPages(response.pages);

      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, selectedGenres, selectedRegions, selectedYears]);

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
  const sortedAndFilteredMovies = useMemo(() => {
    const filtered = movies.filter((movie) => {
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
    });

    // Sort by year (descending)
    return [...filtered].sort((a, b) => b.year - a.year);
  }, [movies, selectedGenres, selectedRegions, selectedYears, genreMap]);

  // Paginate the filtered results
  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
    return sortedAndFilteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [sortedAndFilteredMovies, currentPage]);

  const displayedMovies = paginatedMovies;

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
            {displayedMovies.length > 0 ? (
              view === "grid" ? (
                <div className="movie-grid">
                  {displayedMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={{
                        ...movie,
                        year: movie.year.toString(),
                      }}
                      liked={likedMovies.includes(movie.id)}
                      addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                      onLike={() => toggleLike(movie.id)}
                      onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
                      allReviews={reviews}
                    />
                  ))}
                </div>
              ) : (
                <div className="movie-list">
                  {displayedMovies.map((movie) => {
                    // Map genre IDs to names
                    const genreNames = movie.genre?.map(id => genreMap[id]) || [];

                    // Map region code to region name
                    const regionName = regionMap[movie.region] || movie.region;

                    // Prepare transformed movie
                    const transformedMovie = {
                      ...movie,
                      year: movie.year.toString(),
                      genreNames,
                      regionName,
                    };

                    return (
                      <MovieCardList
                        key={movie.id}
                        movie={transformedMovie}
                        liked={likedMovies.includes(movie.id)}
                        addedToWatchlist={addToWatchlistMovies.includes(movie.id)}
                        onLike={() => toggleLike(movie.id)}
                        onAddToWatchlist={() => toggleAddToWatchlist(movie.id)}
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
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || loading}
            >
              Previous
            </button>

            <span>Page {currentPage} of {totalPages}</span>

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= totalPages || loading}
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </main>
  );
};

export default DirectoryPage;
