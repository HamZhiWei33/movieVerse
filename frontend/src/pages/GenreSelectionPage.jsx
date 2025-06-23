import "../styles/general/general.css";
import "../styles/general/genre-selection.css";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GenreCard from "../components/general/GenreCard";
import useGenreStore from "../store/useGenreStore";
import { useAuthStore } from "../store/useAuthStore";
import useMovieStore from "../store/useMovieStore";

const GenreSelectionPage = () => {
    const { genreMap, fetchGenres } = useGenreStore();
    const { authUser, updateFavouriteGenres } = useAuthStore();
    const { movies, loading, fetchMovies } = useMovieStore();

    const navigate = useNavigate();
    const location = useLocation();

    const [genreSelected, setGenreSelected] = useState([]);

    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect') || '/';

    // Fetch genres and movies on mount if not enough
    useEffect(() => {
        if (Object.keys(genreMap).length <= 0) {
            fetchGenres();
        }
        if (movies.length < 1000 && !loading) {
            fetchMovies(1, 1000, {});
        }
    }, []);

    useEffect(() => {
        setGenreSelected(authUser?.favouriteGenres.map(String) ?? []);
    }, [authUser]);

    // Convert genreMap to array when it changes
    const genres = useMemo(() => {
        return Object.entries(genreMap).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    }, [genreMap]);

    const updateGenreCount = (selected, genre) => {
        if (selected) {
            setGenreSelected((prev) => [...prev, genre.id]);
        } else {
            setGenreSelected((prev) => prev.filter((t) => t !== genre.id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (genreSelected.length < 3) {
            return;
        }

        try {
            await updateFavouriteGenres(genreSelected);
            navigate(redirectTo);
        } catch (err) {
            console.error("Failed to fetch user data:", err);
        }
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
                    {genres.map((item) => (
                        <GenreCard key={item.id} genre={item} onCardClicked={updateGenreCount} favouriteGenres={authUser?.favouriteGenres ?? []} />
                    ))}
                </div>
                <div className="submit-button-wrapper">
                    <button
                        className={`submitButton ${genreSelected.length < 3 ? "disabled" : ""}`}
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
