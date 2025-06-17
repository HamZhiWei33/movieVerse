import "../styles/navbar.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useMovieStore from "../store/useMovieStore";
import usePreviousScrollStore from "../store/usePreviousScrollStore";
import SearchItem from "./SearchItem";

const SearchBar = () => {
  const { fetchMovies } = useMovieStore();
  const { setPreviousScrollPosition } = usePreviousScrollStore();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [wasInputFocused, setWasInputFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const response = await fetchMovies(1, 1000, {
          genres: "",
          regions: "",
          years: "",
        });
        setMovies(response.data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };

    fetchAllMovies();
  }, [fetchMovies]);

  useEffect(() => {
    console.log(movies);
  }, [movies]);

  // Filter items based on search term
  useEffect(() => {
    if (!inputFocused) {
      return;
    }
    if (searchTerm.trim() === "") {
      setFilteredItems([]);
      // setIsDropdownOpen(false);
    } else {
      console.log("searchTerm: " + searchTerm);
      console.log(movies.length);
      const itemsWithMatchPositions = movies
        .map((movie) => {
          const title = movie.title.toLowerCase();
          const matchIndex = title.indexOf(searchTerm.toLowerCase());
          return {
            original: movie,
            title: title,
            matchIndex: matchIndex,
          };
        })
        .filter((item) => item.matchIndex !== -1)
        .sort((a, b) => {
          // First sort by match position (earlier matches first)
          if (a.matchIndex !== b.matchIndex) {
            return a.matchIndex - b.matchIndex;
          }
          // If same position, sort alphabetically
          return a.title.localeCompare(b.title);
        })
        .map((item) => item.original);
      setFilteredItems(itemsWithMatchPositions.slice(0, 10));
      // setIsDropdownOpen(itemsWithMatchPositions.length > 0);
    }
  }, [searchTerm]);

  useEffect(() => {
    console.log(filteredItems);
  }, [filteredItems]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchItemClick = (movie) => {
    setIsDropdownOpen(false);
    setSearchTerm(movie.title);
    setFilteredItems([movie]);

    setPreviousScrollPosition(window.scrollY);
    navigate(`/movie/${movie._id}`, {
      state: { movie },
    });
  };

  const clearInput = () => {
    setSearchTerm("");
    if (wasInputFocused) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputRef.current.blur();
    setIsDropdownOpen(false);
    if (searchTerm.trim().length === 0) {
      return;
    }
    const params = new URLSearchParams();
    params.set("query", searchTerm);
    params.set("view", "grid");
    navigate(`/directory?${params.toString()}`, {
      state: {
        filteredSearchMovies: filteredItems,
        searchQuery: searchTerm,
      },
    });
  };

  return (
    <div className="search-wrapper">
      <div className="search-container" ref={dropdownRef}>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="search-bar" role="search" aria-label="Site search">
            <SearchIcon size={20} />
            <input
              id="searchInput"
              type="text"
              placeholder="Search..."
              aria-label="Search input"
              value={searchTerm}
              ref={inputRef}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                setIsDropdownOpen(true);
                setInputFocused(true);
                if (filteredItems.length > 0) {
                  setIsDropdownOpen(true);
                }
              }}
              onBlur={() => setInputFocused(false)}
            />
            {searchTerm.trim().length > 0 && (
              <ClearIcon
                size={20}
                style={{ cursor: "pointer" }}
                onMouseDown={() =>
                  setWasInputFocused(
                    document.activeElement === inputRef.current
                  )
                }
                onClick={clearInput}
              />
            )}

            {/* <button onClick={() => console.log('Search for:', searchTerm)}>
                        Search
                    </button> */}
          </div>
        </form>

        {isDropdownOpen && searchTerm.trim().length > 0 && (
          <div className="dropdown">
            {filteredItems.length > 0
              ? filteredItems.map((movie, index) => (
                  <SearchItem
                    movie={movie}
                    key={index}
                    onClick={() => handleSearchItemClick(movie)}
                  />
                  // <div
                  //     key={index}
                  //     className="search-dropdown-item"
                  //     onClick={() => handleSearchItemClick(movie)}
                  // >
                  //     {movie.title}
                  // </div>
                ))
              : searchTerm.trim().length > 0 && (
                  <div className="search-dropdown-item" id="no-results">
                    No results found
                  </div>
                )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
