// const RankingSection = ({ genres }) => (
//     <div>
//       <h2>Ranking</h2>
//       <div className="flex space-x-4">
//         {genres.map(genre => (
//           <div key={genre.name}>
//             <h3 onClick={() => navigate(`/directory/genre/${genre.name.toLowerCase()}`)}>
//               {genre.name}
//             </h3>
//             <ul>
//               {genre.topMovies.map(movie => (
//                 <li key={movie.id}>{movie.title}</li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
  