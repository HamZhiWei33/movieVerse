const RecommendationSection = ({ allRecommendedMovies }) => {
    const [displayed, setDisplayed] = useState([]);
  
    const shuffleMovies = () => {
      const shuffled = [...allRecommendedMovies].sort(() => 0.5 - Math.random());
      setDisplayed(shuffled.slice(0, 6));
    };
  
    useEffect(() => {
      shuffleMovies();
    }, []);
  
    return (
      <div>
        <h2>Recommendation <button onClick={shuffleMovies}>Change</button></h2>
        <div className="grid grid-cols-3 gap-4">
          {displayed.map(movie => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </div>
    );
  };
  