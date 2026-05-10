import "../styles/navbar.css";

const SearchItem = ({ movie, onClick, keyword = "" }) => {
    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = movie.title.split(regex);

    return (
        <div
            key={movie.title}
            className="search-dropdown-item"
            onClick={onClick}
        >
            <div>
                <img className="" src={movie.posterUrl} />
                <div className="search-movie-title-container">
                    {parts.map((part, index) => (
                        <span
                            key={`part-${index}`}
                            className={`${part.toLowerCase() === keyword.toLowerCase() ? "highlighted-keyword" : ""}`}
                        >
                            {part}
                        </span>))}
                </div>
            </div>
        </div>
    );
};

export default SearchItem;