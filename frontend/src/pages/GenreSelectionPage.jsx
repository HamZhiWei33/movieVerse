import "../styles/general/general.css";
import "../styles/general/genre-selection.css";
import React, { useState } from "react";
// import FormField from "../components/general/FormField";
import GenreCard from "../components/general/GenreCard";
import { genres } from "../constant";
import { useNavigate } from "react-router-dom";
const GenreSelectionPage = () => {
  //   const [email, setEmail] = useState("");
  //   const [password, setPassword] = useState("");
  const [genreCount, setGenreCount] = useState(0);
  const navigate = useNavigate();
  const updateGenreCount = (selected) => {
    if (selected) {
      setGenreCount(genreCount + 1);
      console.log("Added");
    } else {
      setGenreCount(genreCount - 1);
      console.log("Removed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (genreCount < 3) {
      return;
    }

    console.log("Form submitted with selected genres");
    navigate("/login");
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
            <GenreCard genre={item} onCardClicked={updateGenreCount} />
          ))}
        </div>
        <button
          className={`submitButton ${genreCount < 3 ? "disabled" : ""}`}
          type="submit"
          style={{ marginTop: "0.5rem" }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </section>
    </main>
  );
};
export default GenreSelectionPage;
