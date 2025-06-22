import "../styles/profile.css";
import Profile from "../components/profile/Profile";
import Tab from "../components/profile/Tab";

const ProfilePage = () => {
  return (
    <main className="profile-page">
      <Profile />
      <Tab />
    </main>
  );
};

export default ProfilePage;
