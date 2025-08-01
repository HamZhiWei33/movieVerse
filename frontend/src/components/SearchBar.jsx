import "../styles/navbar.css";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import useMovieStore from "../store/useMovieStore";
import usePreviousScrollStore from "../store/usePreviousScrollStore";
import SearchItem from "./SearchItem";

const SearchBar = () => {
    const { movies, loading, fetchMovies } = useMovieStore();
    const { setPreviousScrollPosition } = usePreviousScrollStore();

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState("");
    const [wasInputFocused, setWasInputFocused] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const formRef = useRef(null);

    useEffect(() => {
        if (!loading && movies.length < 500 && !location.pathname.startsWith("/directory")) {
            fetchMovies(1, 1000, { sort: "-year" }); // Fetch newest movies
        }

        // Close dropdown when clicking outside
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

    // Filter movies based on search term
    const filteredMovies = useMemo(() => searchTerm.trim() === "" ? [] : (
        movies.map((movie) => {
            const title = movie.title.toLowerCase();
            const matchIndex = title.indexOf(searchTerm.toLowerCase());
            return {
                movie: movie,
                title: title,
                matchIndex: matchIndex,
            };
        })
            .filter((item) => item.matchIndex !== -1)
            .sort((a, b) => a.matchIndex !== b.matchIndex ? a.matchIndex - b.matchIndex : a.title.localeCompare(b.title))
            .map((item) => item.movie)
    ), [searchTerm, movies]);

    const clearInput = () => {
        setSearchTerm("");
        if (wasInputFocused) {
            inputRef.current.focus();
        }

        // Reset directory page when search is removed
        if (location.pathname.startsWith("/directory")) {
            searchParams.delete("query");
            setSearchParams(searchParams);
        }
    };

    const handleSearchItemClick = (movie) => {
        setIsDropdownOpen(false);
        setSearchTerm(movie.title);

        setPreviousScrollPosition(window.scrollY);
        navigate(`/movie/${movie._id}`, {
            state: { movie },
        });
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
                filteredSearchMovies: filteredMovies,
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
                                if (filteredMovies.length > 0) {
                                    setIsDropdownOpen(true);
                                }
                            }}
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
                    </div>
                </form>

                {isDropdownOpen && searchTerm.trim().length > 0 && (
                    <div className="dropdown">
                        {filteredMovies.length > 0 ? (
                            filteredMovies.map((movie, index) => <SearchItem movie={movie} key={index} onClick={() => handleSearchItemClick(movie)} keyword={searchTerm} />)
                        ) : (
                            searchTerm.trim().length > 0 && (
                                <div className="search-dropdown-item" id="no-results">
                                    No results found
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
