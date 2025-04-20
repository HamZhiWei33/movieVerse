import Profile from "../components/profile/Profile";
import Tab from "../components/profile/Tab";
import "../styles/profile.css";
const ProfilePage = () => {
  return (
    <main className="profile-page">
      {/* <h1>Profile Page</h1>
      <p>This is the profile page.</p> */}
      <Profile />
      <Tab />
    </main>
  );
};
export default ProfilePage;
