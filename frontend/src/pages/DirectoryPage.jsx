import MovieCard from "../components/directory/MovieCard";
import MovieCardList from "../components/directory/MovieCardList";
import { useEffect, useState, useMemo } from "react";
import {
  useNavigationType,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "../styles/directory.css";
import ViewDropdown from "../components/directory/ViewDropdown";
import { FaListUl } from "react-icons/fa";
import "../styles/sidebar.css";
import Sidebar from "../components/Sidebar";
import usePreviousScrollStore from "../store/usePreviousScrollStore";
import useMovieStore from "../store/useMovieStore";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";

const DirectoryPage = () => {
  const {
    fetchMovies,
    fetchFilterOptions,
    isLiked,
    toggleLike,
    loadMoreMovies,
    hasMore,
    isFetchingMore,
    getState,
  } = useMovieStore();

  const movies = useMovieStore((state) => state.movies);
  const [genres, setGenres] = useState([]);
  const [regions, setRegions] = useState([]);
  const [decades, setDecades] = useState([]);
  const [selectedDecades, setSelectedDecades] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialView = searchParams.get("view") || "grid";
  const [view, setView] = useState(initialView);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearchResult, setIsSearchResult] = useState(false);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [collapsed, setCollapsed] = useState([true, true, true]);

  const location = useLocation();

  const { previousScrollPosition, clearScrollPosition } =
    usePreviousScrollStore();
  const navigationType = useNavigationType();

  const [loadMoreRef, setLoadMoreRef] = useState(null);

  const getDecadeFromYear = (year) => {
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) return null;
    return `${Math.floor(yearNum / 10) * 10}s`;
  };

  const decadeToYears = (value) => {
    if (value.endsWith("s")) {
      const base = parseInt(value.replace("s", ""), 10);
      return Array.from({ length: 10 }, (_, i) => base + i);
    }
    return [parseInt(value, 10)];
  };

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
    setIsSearchResult(searchParams.get("query") !== null);
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
        const needsFilterOptions =
          genres.length === 0 || regions.length === 0 || decades.length === 0;
        if (needsFilterOptions) {
          const filterOptions = await fetchFilterOptions();
          setGenres(filterOptions.genres || []);
          setRegions(filterOptions.regions || []);
          const allYears = filterOptions.years || [];
          const groupedDecades = Array.from(
            new Set(
              allYears
                .filter((y) => parseInt(y) < 2020)
                .map((year) => getDecadeFromYear(year))
            )
          ).sort((a, b) => b.localeCompare(a));

          const individualYears = allYears
            .filter((y) => parseInt(y) >= 2020)
            .map((y) => y.toString())
            .sort((a, b) => b - a);

          setDecades([...individualYears, ...groupedDecades]);
        }

        const selectedYears = selectedDecades.flatMap(decadeToYears);

        const searchQuery = searchParams.get("query"); // Get search query from URL

        const filters = {
          genres:
            selectedGenres.length > 0 ? selectedGenres.join(",") : undefined, // Only send if selected
          regions:
            selectedRegions.length > 0 ? selectedRegions.join(",") : undefined, // Only send if selected
          years: selectedYears.length > 0 ? selectedYears.join(",") : undefined, // Send raw years to the API, only if selected
          query: searchQuery || undefined, // Pass search query
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
  }, [selectedGenres, selectedRegions, selectedDecades, searchParams]);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (
          entry.isIntersecting &&
          !isFetchingMore &&
          hasMore &&
          !isSearchResult
        ) {
          console.log("Loading more movies...");
          try {
            await loadMoreMovies();
          } catch (error) {
            console.error("Error loading more movies:", error);
          }
        }
      },
      {
        threshold: 0.2,
        rootMargin: "300px",
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
  // useEffect(() => {
  //   console.log('Movie state updated:', {
  //     count: movies.length,
  //     page: getState().currentPage,
  //     hasMore,
  //     loading,
  //     isFetchingMore
  //   });
  // }, [movies, hasMore, loading, isFetchingMore, getState]);

  useEffect(() => {
    if (
      !loading &&
      movies.length > 0 &&
      previousScrollPosition > 0 &&
      navigationType === "POP"
    ) {
      window.scrollTo(0, previousScrollPosition);
      clearScrollPosition();
    }
  }, [
    navigationType,
    movies,
    loading,
    previousScrollPosition,
    clearScrollPosition,
  ]);

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
  // const filteredMovies = useMemo(() => {
  //   // For search
  //   if (location.state !== null) {
  //     const { filteredSearchMovies = [], searchQuery = '' } = location.state || {};
  //     setSearchedMovies(filteredSearchMovies);
  //     return filteredSearchMovies;
  //   }

  //   if(isSearchResult) {
  //     // console.error(filteredMovies);
  //     return searchedMovies;
  //   }
  //   console.error("Outsie Triggered!");
  //   // console.error(location.state);

  //   if (!movies || movies.length === 0) return [];

  //   return movies.filter((movie) => {
  //     // First ensure the movie has a trailer
  //     if (!movie.trailerUrl) return false;

  //     // Then apply other filters
  //     if (selectedGenres.length === 0 &&
  //       selectedRegions.length === 0 &&
  //       selectedDecades.length === 0) {
  //       return true;
  //     }

  //     const genreMatch = selectedGenres.length === 0 ||
  //       (movie.genre && movie.genre.some(id => {
  //         const genreName = genreMap[id];
  //         return genreName && selectedGenres.includes(genreName);
  //       }));

  //     const regionMatch = selectedRegions.length === 0 ||
  //       (movie.region && selectedRegions.includes(movie.region));

  //     const decadeMatch = selectedDecades.length === 0 ||
  //       (movie.year != null && selectedDecades.some(selected => {
  //         const targetYears = decadeToYears(selected);
  //         return targetYears.includes(parseInt(movie.year, 10));
  //       }));

  //     return genreMatch && regionMatch && decadeMatch;
  //   });
  // }, [movies, selectedGenres, selectedRegions, selectedDecades, genreMap]);

  const filteredMovies = movies;

  const handleClearAllFilters = () => {
    // 1. Clear local state for filters
    setSelectedGenres([]);
    setSelectedRegions([]);
    setSelectedDecades([]);

    // 2. Clear filter-related search parameters from the URL
    // Create a new URLSearchParams object based on current params
    const newSearchParams = new URLSearchParams(searchParams.toString());

    // Delete the parameters related to filters and search query
    newSearchParams.delete("genres");
    newSearchParams.delete("regions");
    newSearchParams.delete("years"); // If you were storing combined years directly
    newSearchParams.delete("query"); // Crucial for clearing search results

    // Update the URL without navigating, which will trigger the useEffect
    setSearchParams(newSearchParams);

    // Optional: Reset isSearchResult if it's explicitly tied to a query param
    setIsSearchResult(false);
  };

  useEffect(() => {
    console.log(collapsed);
  }, [collapsed]);

  const renderButtons = (items, selected, setSelected, index = 0, collapseRow = 3) => {

    const buttons = items.map((item, index) => {
      const label = item.label || item;
      const value = item.value || item;
      return (
        <div
          key={index}
          className={`filter-button ${selected.includes(value) ? "active" : ""
            }`}
          onClick={() => toggleFilter(value, selected, setSelected)}
          aria-pressed={selected.includes(value)}
        >
          {label}
        </div>
      );
    });

    const toggleCollapse = () => {
      setCollapsed(prevArray =>
        prevArray.map((item, i) =>
          i === index ? !item : item
        )
      );
    }
    return (
      <div className="filter-group">
        {/* {items.map((item, index) => {
          const label = item.label || item;
          const value = item.value || item;
          return (
            <button
              key={index}
              className={`filter-button ${selected.includes(value) ? "active" : ""
                }`}
              onClick={() => toggleFilter(value, selected, setSelected)}
              aria-pressed={selected.includes(value)}
            >
              {label}
            </button>
          );
        })} */}
        {
          buttons.slice(0, collapsed[index] ? collapseRow * 3 - 1 : buttons.length)
        }
        <div
          className={`filter-button`}
          onClick={toggleCollapse}
        // aria-pressed={selected.includes(value)}
        >
          {collapsed[index] ? (
            <FaAngleDown />
          ) : (
            <FaAngleUp />
          )}
        </div>
      </div>
    )
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
        <div
          className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}
        >
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
                items: decades.map((d) => ({ label: d, value: d })),
                selected: selectedDecades,
                setSelected: setSelectedDecades,
              },
            ]}
          />
        </div>

        {isSidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={toggleSidebar}
            aria-hidden="true"
          ></div>
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
                  {renderButtons(
                    genres.map((g) => g.name),
                    selectedGenres,
                    setSelectedGenres,
                    0
                  )}
                </fieldset>
              </section>

              <section id="region">
                <fieldset>
                  <legend>Region</legend>
                  {renderButtons(
                    regions.map((r) => ({ label: r.name, value: r.code })),
                    selectedRegions,
                    setSelectedRegions,
                    1
                  )}
                </fieldset>
              </section>

              <section id="year">
                <fieldset>
                  <legend>Year</legend>
                  {renderButtons(
                    decades.map((decade) => ({ label: decade, value: decade })),
                    selectedDecades,
                    setSelectedDecades,
                    2
                  )}{" "}
                </fieldset>
              </section>

              <ViewDropdown view={view} setView={setView} />
            </section>

            {(selectedGenres.length > 0 ||
              selectedRegions.length > 0 ||
              selectedDecades.length > 0) && (
                <div className="clear-filters-container">
                  <button
                    className="clear-filters-button active"
                    onClick={handleClearAllFilters} // Use the new handler
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
                <div className="directory-loading-movie">
                  <DotLottieReact
                    src="https://lottie.host/6185175f-ee83-45a4-9244-03871961a1e9/yLmGLfSgYI.lottie"
                    loop
                    autoplay
                    className="loading-icon"
                  />
                </div>
              </div>
            ) : filteredMovies.length > 0 ? (
              view === "grid" ? (
                <>
                  <div className="movie-grid">
                    {filteredMovies.map((movie) => (
                      <MovieCard
                        key={`${movie._id}-${movie.tmdbId}`}
                        movie={movie}
                        liked={isLiked(movie._id)}
                        likeCount={movie.likeCount}
                        onLike={() => toggleLike(movie._id)}
                      />
                    ))}
                  </div>
                  <div ref={setLoadMoreRef} className="load-more-trigger">
                    {isFetchingMore && !isSearchResult && (
                      <div className="directory-loading-movie">
                        <DotLottieReact
                          src="https://lottie.host/6185175f-ee83-45a4-9244-03871961a1e9/yLmGLfSgYI.lottie"
                          loop
                          autoplay
                          className="loading-icon"
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="movie-list">
                    {filteredMovies.map((movie) => (
                      <MovieCardList
                        key={`${movie._id}-${movie.tmdbId}`}
                        movie={movie}
                        genres={movie.genre?.map((id) => genreMap[id]) || []}
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
                      minHeight: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "20px",
                    }}
                  >
                    {!isSearchResult &&
                      (isFetchingMore ? (
                        <DotLottieReact
                          src="https://lottie.host/6185175f-ee83-45a4-9244-03871961a1e9/yLmGLfSgYI.lottie"
                          loop
                          autoplay
                          className="loading-icon"
                        />
                      ) : hasMore ? (
                        <button onClick={loadMoreMovies}>Load More</button>
                      ) : (
                        <p>No more movies to load</p>
                      ))}
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
                    setSelectedDecades([]);
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
