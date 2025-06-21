import "../../styles/profile/profile.css";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RiEditLine } from "react-icons/ri";
import { FaCamera, FaCheck, FaTimes } from "react-icons/fa";
import { UserValidationContext } from "../../context/UserValidationProvider ";
import { useAuthStore } from "../../store/useAuthStore";
const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useContext(UserValidationContext);
  const { authUser, updateProfile, deleteAccount } = useAuthStore();

  // Local states synced with authUser
  const [name, setName] = useState("");
  const [tempName, setTempName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);

  const [gender, setGender] = useState("");
  const [tempGender, setTempGender] = useState("");
  const [isEditingGender, setIsEditingGender] = useState(false);

  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setTempName(authUser.name || "");
      setGender(authUser.gender || "");
      setTempGender(authUser.gender || "");
      setSelectedImg(authUser.profilePic || null);
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const confirmEditing = async () => {
    setName(tempName);
    setIsEditingName(false);
    await updateProfile({ name: tempName });
  };

  const cancelEditing = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const confirmGenderEdit = async () => {
    setGender(tempGender);
    setIsEditingGender(false);
    await updateProfile({ gender: tempGender });
  };

  const cancelGenderEdit = () => {
    setTempGender(gender);
    setIsEditingGender(false);
  };

  const handlePasswordChange = () => {
    navigate("/change_password");
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmation) {
      try {
        await deleteAccount();
        logout();
        navigate("/");
      } catch (error) {
        console.error("Error deleting account:", error);
      }
    }
  };

  return (
    <section className="profile-section">
      <div className="profile-header">
        <h1 id="profile-heading">Profile</h1>
      </div>

      <div className="profile-container">
        {/* Profile Image */}
        <figure className="left" aria-label="Profile image section">
          <div className="profile-image">
            <div>
              <img
                src={
                  selectedImg ||
                  authUser?.profilePic ||
                  "/profile/placeholder_avatar.svg"
                }
                alt="profile picture"
                height={100}
                aria-describedby="image-instruction"
              />
              <label htmlFor="avatar-upload" className="custom-file-upload">
                <FaCamera />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  aria-label="Select an image to upload"
                />
              </label>
            </div>
          </div>
          <p id="image-instruction">Click the camera icon to update photo</p>
        </figure>

        {/* Profile Info */}
        <div
          className="right"
          role="region"
          aria-label="Profile information section"
        >
          <div className="profile-content">
            {/* Name */}
            <div className="profile-row">
              <div className="profile-info">
                {isEditingName ? (
                  <>
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="profile-input"
                      autoFocus
                      aria-label="Edit name input"
                    />
                    <button
                      className="edit-icon confirm"
                      onClick={confirmEditing}
                      aria-label="Confirm name change"
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="edit-icon cancel"
                      onClick={cancelEditing}
                      aria-label="Cancel name change"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="profile-name">{name || "-"}</h3>
                    <button
                      className="edit-icon edit"
                      onClick={() => setIsEditingName(true)}
                      aria-label="Edit name"
                    >
                      <RiEditLine />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Gender */}
            <div className="profile-row">
              <div className="profile-info">
                <label className="profile-label">Gender</label>
                {isEditingGender ? (
                  <>
                    <select
                      className="profile-select"
                      value={tempGender}
                      onChange={(e) => setTempGender(e.target.value)}
                    >
                      <option value="-">-</option>
                      <option value="male">male</option>
                      <option value="female">female</option>
                    </select>
                    <button
                      className="edit-icon confirm"
                      onClick={confirmGenderEdit}
                    >
                      <FaCheck />
                    </button>
                    <button
                      className="edit-icon cancel"
                      onClick={cancelGenderEdit}
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="profile-value gender">
                      {gender ? gender : "-"}
                    </span>
                    <button
                      className="edit-icon edit"
                      onClick={() => setIsEditingGender(true)}
                    >
                      <RiEditLine />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="profile-row">
              <div className="profile-info">
                <label className="profile-label">Email</label>
                <span className="profile-value">
                  {authUser?.email || "@gmail.com"}
                </span>
              </div>
            </div>

            {/* Manage */}
            <div className="profile-row">
              <ul className="manage-container">
              <li className="manage-item">
                  <button
                    type="button"
                    className="btn-change-password"
                    onClick={()=>{navigate("/genre_selection")}}
                  >
                    Favourite Genres
                  </button>
                </li>
                <li className="manage-item">
                  <button
                    type="button"
                    className="btn-change-password"
                    onClick={handlePasswordChange}
                  >
                    Change Password
                  </button>
                </li>
                <li className="manage-item">
                  <button
                    type="button"
                    className="btn-delete-account"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                    <span className="sr-only">
                      Warning: This action cannot be undone
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
