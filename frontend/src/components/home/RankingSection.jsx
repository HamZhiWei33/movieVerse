import GenreRankingCard from "./GenreRankingCard";

const RankingSection = ({ genres }) => {
  return (
    <section className="p-6 text-white">
      <h2 className="text-2xl font-semibold mb-4">Ranking</h2>
      <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
        {genres.map((genre) => (
          <GenreRankingCard
            key={genre.name}
            genre={genre.name}
            movies={genre.topMovies}
          />
        ))}
      </div>
    </section>
  );
};

export default RankingSection;
