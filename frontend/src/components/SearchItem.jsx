import "../styles/navbar.css";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from '@mui/icons-material/Clear';
import useMovieStore from "../store/useMovieStore";
import usePreviousScrollStore from "../store/usePreviousScrollStore";

const SearchItem = ({ movie, key, onClick, keyword = "" }) => {

    // const searchTerms = Array.isArray(keyword) ? keyword : [keyword];

    // if (!searchTerms.length || !searchTerms[0]) return <>{text}</>;

    const regex = new RegExp(
        `(${keyword})`,
        'gi'
    );

    console.log(regex);

    const parts = movie.title.split(regex);
    return (
        <div
            key={key}
            className="search-dropdown-item"
            onClick={onClick}
        >
            <div>
                <img className="" src={movie.posterUrl} />
                <div className="search-movie-title-container">
                    {parts.map((part, i) => <span className={`${part.toLowerCase() === keyword.toLowerCase() ? "highlighted-keyword" : ""}`}>{part}</span>)}
                </div>

                {/* <span>{movie.title}</span> */}
            </div>
        </div>
    );
};

export default SearchItem;