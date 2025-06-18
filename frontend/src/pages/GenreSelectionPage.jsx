import "../styles/general/general.css";
import "../styles/general/genre-selection.css";
import React, { useState, useEffect } from "react";
import GenreCard from "../components/general/GenreCard";
import useGenreStore from "../store/useGenreStore";
// import useMovieStore from "../store/useMovieStore";
import { useAuthStore } from "../store/useAuthStore";
// import { genres } from "../constant";
import { useNavigate, useLocation } from "react-router-dom";

const GenreSelectionPage = () => {
    const { genreMap, fetchGenres } = useGenreStore();
    // const { getCurrentUser } = useMovieStore();
    const { authUser, updateFavouriteGenres } = useAuthStore();
    const [genres, setGenres] = useState([]);

    const [currentUser, setCurrentUser] = useState(null);
    const [favouriteGenres, setFavouriteGenres] = useState([]);
    const [genreCount, setGenreCount] = useState(0);
    const [genreSelected, setGenreSelected] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect') || '/';

    const updateGenreCount = (selected, genre) => {
        if (selected) {
            setGenreSelected((prev) => [...prev, genre.id]);
            setGenreCount(genreCount + 1);
        } else {
            setGenreSelected((prev) => prev.filter((t) => t !== genre.id));
            setGenreCount(genreCount - 1);
        }
    };

    // Debug, check if genre added/removed
    useEffect(() => {
        console.log(genreSelected);
    }, [genreSelected]);

    // Debug, check if current user fetched
    useEffect(() => {
        if (currentUser != null) {
            setFavouriteGenres(currentUser.favouriteGenres);
            setGenreSelected(currentUser.favouriteGenres.map(String));
            setGenreCount(currentUser.favouriteGenres.length);
        }
    }, [currentUser]);

    // Fetch genres on mount
    useEffect(() => {
        fetchGenres();
    }, [fetchGenres]);

    // useEffect(() => {
    //     const fetchCurrentUser = async () => {
    //         try {
    //             const userData = await getCurrentUser();
    //             setCurrentUser(userData);
    //         } catch (err) {
    //             console.error("Failed to fetch user data:", err);
    //         }
    //     };
    //     fetchCurrentUser();
    // }, [getCurrentUser]);

    useEffect(() => {
        setCurrentUser(authUser);
    }, [authUser]);

    // Convert genreMap to array when it changes
    useEffect(() => {
        if (Object.keys(genreMap).length > 0) {
            const genreArray = Object.entries(genreMap)
                .map(([id, name]) => ({ id, name }))
                .sort((a, b) => a.name.localeCompare(b.name));
            setGenres(genreArray);
        }
    }, [genreMap]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (genreCount < 3) {
            return;
        }

        const saveFavouriteGenres = async () => {
            try {
                const userData = await updateFavouriteGenres(genreSelected);
                console.log("Form submitted with selected genres");
                navigate(redirectTo);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };
        saveFavouriteGenres();
    };

    return (
        <main className="genre-selection-page">
            <section className="genre-selection-section">
                <div className="title">
                    <h1 style={{ textAlign: "center" }}>
                        Which genre do you prefer to look for?
                    </h1>
                    <p style={{ color: "#BFBFBF" }}>Choose at least 3.</p>
                </div>
                <div className="genre-grid">
                    {genres.map((item, index) => (
                        <GenreCard key={item.id} genre={item} onCardClicked={updateGenreCount} favouriteGenres={favouriteGenres} />
                    ))}
                </div>
                <div className="submit-button-wrapper">
                    <button
                        className={`submitButton ${genreCount < 3 ? "disabled" : ""}`}
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </section>
        </main>
    );
};
export default GenreSelectionPage;