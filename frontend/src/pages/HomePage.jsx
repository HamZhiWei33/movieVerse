import StarRating from "../components/StarRating";
import "../styles/home.css";
const HomePage = () => {
  return (
    <main className="home-page">
      <h1>Welcome to the Home Page</h1>
      <p>This is the home page of our application.</p>
      <StarRating rating={5} />
    </main>
  );
};
export default HomePage;
