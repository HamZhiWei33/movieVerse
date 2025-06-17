import MovieCard from "../components/directory/MovieCard";
import MovieCardList from "../components/directory/MovieCardList";
import { useEffect, useState, useMemo } from "react";
import { useNavigationType, useSearchParams, useLocation } from "react-router-dom";
import "../styles/directory.css";
import ViewDropdown from "../components/directory/ViewDropdown";
import { FaListUl } from "react-icons/fa";
import "../styles/sidebar.css";
import Sidebar from "../components/Sidebar";
import usePreviousScrollStore from "../store/usePreviousScrollStore";
import useMovieStore from "../store/useMovieStore";

const DirectoryPage = () => {
  const {
    fetchMovies,
    fetchFilterOptions,
    isLiked,
    toggleLike,
    loadMoreMovies,
    hasMore,
    isFetchingMore,
    getState
  } = useMovieStore();

  const movies = useMovieStore(state => state.movies); const [genres, setGenres] = useState([]);
  const [regions, setRegions] = useState([]);
  const [years, setYears] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = searchParams.get("view") || "grid";
  const [view, setView] = useState(initialView);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [searchedMovies, setSearchedMovies] = useState([]);

  const location = useLocation();

  const { previousScrollPosition, clearScrollPosition } = usePreviousScrollStore();
  const navigationType = useNavigationType();

  const [loadMoreRef, setLoadMoreRef] = useState(null);

  useEffect(() => {
    searchParams.set("view", view);
    setSearchParams(searchParams);
    console.log("view: " + view);
    console.log(isSearchResult);
  }, [view]);

  // Debug
  useEffect(() => {
    if (searchParams.get("view") === null) {
      searchParams.set("view", view);
      setSearchParams(searchParams);
    }
    setIsSearchResult(searchParams.get('query') !== null);
    // const { filteredSearchMovies = [], searchQuery = '' } = location.state || {};
    // if (location.state !== null) {
      
    //   console.log(filteredSearchMovies);
    //   console.log(searchQuery);
    // }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // First load filter options if needed
        const needsFilterOptions = genres.length === 0 || regions.length === 0 || years.length === 0;
        if (needsFilterOptions) {
          const filterOptions = await fetchFilterOptions();
          setGenres(filterOptions.genres || []);
          setRegions(filterOptions.regions || []);
          setYears(filterOptions.years || []);
        }

        // Then load movies with current filters
        const filters = {
          genres: selectedGenres.join(','),
          regions: selectedRegions.join(','),
          years: selectedYears.join(',')
        };

        await fetchMovies(1, 20, filters); // Reduced initial load to 20 for better UX
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedGenres, selectedRegions, selectedYears]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && !isFetchingMore && hasMore) {
          console.log('Loading more movies...');
          try {
            await loadMoreMovies();
          } catch (error) {
            console.error('Error loading more movies:', error);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: '400px'
      }
    );

    if (loadMoreRef) {
      observer.observe(loadMoreRef);
    }

    return () => {
      if (loadMoreRef) {
        observer.unobserve(loadMoreRef);
      }
    };
  }, [loadMoreRef, hasMore, isFetchingMore, loadMoreMovies]);

  // Add debug effect
  useEffect(() => {
    console.log('Movie state updated:', {
      count: movies.length,
      page: getState().currentPage,
      hasMore,
      loading,
      isFetchingMore
    });
  }, [movies, hasMore, loading, isFetchingMore]);

  // Deduplicate movies when filters change
  useEffect(() => {
    const uniqueMovies = movies.reduce((acc, movie) => {
      const existing = acc.find(m =>
        m._id === movie._id ||
        (m.tmdbId && movie.tmdbId && m.tmdbId === movie.tmdbId)
      );
      if (!existing) {
        acc.push(movie);
      }
      return acc;
    }, []);

    if (uniqueMovies.length !== movies.length) {
      useMovieStore.setState({ movies: uniqueMovies });
    }
  }, [movies, selectedGenres, selectedRegions, selectedYears]);

  useEffect(() => {
    if (!loading && movies.length > 0 && previousScrollPosition > 0) {
      window.scrollTo(0, previousScrollPosition);
      clearScrollPosition();
    }
  }, [navigationType, movies, loading]);

  const genreMap = useMemo(() => {
    return genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});
  }, [genres]);

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

  // In your filteredMovies useMemo:
  const filteredMovies = useMemo(() => {
    // For search
    if (location.state !== null) {
      const { filteredSearchMovies = [], searchQuery = '' } = location.state || {};
      setSearchedMovies(filteredSearchMovies);
      return filteredSearchMovies;
    }

    if(isSearchResult) {
      // console.error(filteredMovies);
      return searchedMovies;
    }
    console.error("Outsie Triggered!");
    // console.error(location.state);

    if (!movies || movies.length === 0) return [];

    return movies.filter((movie) => {
      // First ensure the movie has a trailer
      if (!movie.trailerUrl) return false;

      // Then apply other filters
      if (selectedGenres.length === 0 &&
        selectedRegions.length === 0 &&
        selectedYears.length === 0) {
        return true;
      }

      const genreMatch = selectedGenres.length === 0 ||
        (movie.genre && movie.genre.some(id => {
          const genreName = genreMap[id];
          return genreName && selectedGenres.includes(genreName);
        }));

      const regionMatch = selectedRegions.length === 0 ||
        (movie.region && selectedRegions.includes(movie.region));

      const yearMatch = selectedYears.length === 0 ||
        (movie.year != null && selectedYears.some(selectedYear =>
          selectedYear.toString() === movie.year.toString()
        ));

      return genreMatch && regionMatch && yearMatch;
    });
  }, [movies, selectedGenres, selectedRegions, selectedYears, genreMap, searchParams]);

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
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <main className="directory-page">
      <div id="toggle-sidebar-container">
        <button onClick={toggleSidebar}>
          <span><FaListUl id="sidebar-icon" /></span>
        </button>
      </div>

      <div className="layout-container">
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

        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={toggleSidebar} aria-hidden="true"></div>
        )}

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
                  className="clear-filters-button active"
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
              <div className="loading-message"><p>Loading movies...</p></div>
            ) : filteredMovies.length > 0 ? (
              view === "grid" ? (
                <>
                  <div className="movie-grid">
                    {filteredMovies.map((movie) => (
                      <MovieCard
                        key={`${movie._id}-${movie.tmdbId || ''}`}
                        movie={movie}
                        liked={isLiked(movie._id)}
                        likeCount={movie.likeCount}
                        onLike={() => toggleLike(movie._id)}
                      />
                    ))}
                  </div>
                  <div ref={setLoadMoreRef} className="load-more-trigger">
                    {(isFetchingMore && !isSearchResult) && <p>Loading more movies...</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="movie-list">
                    {filteredMovies.map((movie) => (
                      <MovieCardList
                        key={`${movie._id}-${movie.tmdbId || ''}`}
                        movie={movie}
                        genres={movie.genre?.map(id => genreMap[id]) || []}
                        liked={isLiked(movie._id)}
                        likeCount={movie.likeCount}
                        onLike={() => toggleLike(movie._id)}
                      />
                    ))}
                  </div>
                  <div
                    ref={setLoadMoreRef}
                    className="load-more-trigger"
                    style={{
                      minHeight: '20px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '20px'
                    }}
                  >
                    {!isSearchResult && (
                      (isFetchingMore) ? (
                      <div className="loading-spinner">Loading more movies...</div>
                    ) : hasMore ? (
                      <button onClick={loadMoreMovies}>Load More</button>
                    ) : (
                      <p>No more movies to load</p>
                    )
                    )}
                  </div>
                </>
              )
            ) : (
              <div className="no-results">
                <p>No movies match your filters.</p>
                <button
                  className="clear-filters-button"
                  onClick={() => {
                    setSelectedGenres([]);
                    setSelectedRegions([]);
                    setSelectedYears([]);
                  }}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default DirectoryPage;