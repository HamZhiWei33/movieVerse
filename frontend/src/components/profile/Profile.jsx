import React, { useState } from "react";
import "../../styles/profile/profile.css";
import { RiEditLine } from "react-icons/ri";
import { FaCamera } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { CgGenderMale } from "react-icons/cg";
import { CgGenderFemale } from "react-icons/cg";
import { MdEmail } from "react-icons/md";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
const Profile = () => {
  const [name, setName] = useState(
    () => localStorage.getItem("profileName") || "Username"
  );
  const [tempName, setTempName] = useState(name); // temp value while editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [gender, setGender] = useState(() =>
    localStorage.getItem("profileGender" || "-")
  );
  const [tempGender, setTempGender] = useState(gender);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [selectedImg, setSelectedImg] = useState(() => {
    return (
      localStorage.getItem("profileImg") || "/profile/placeholder_avatar.svg"
    );
  });

  const startEditing = () => {
    setTempName(name); // reset temp value to current
    setIsEditingName(true);
  };

  const cancelEditing = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const confirmEditing = () => {
    setName(tempName);
    localStorage.setItem("profileName", tempName);
    setIsEditingName(false);
  };
  const startGenderEdit = () => {
    setTempGender(gender);
    setIsEditingGender(true);
  };

  const cancelGenderEdit = () => {
    setTempGender(gender);
    setIsEditingGender(false);
  };

  const confirmGenderEdit = () => {
    setGender(tempGender);
    localStorage.setItem("profileGender", tempGender);
    setIsEditingGender(false);
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      localStorage.setItem("profileImg", base64Image); // Save to localStorage
      // await updateProfile({ profilePic: base64Image });
    };
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
                src={selectedImg}
                alt="profile picture"
                height={100}
                aria-describedby="image-instruction"
              />
            </div>

            <label htmlFor="avatar-upload" className="custom-file-upload">
              <FaCamera aria-hidden="true" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                aria-label="Select an image to upload"
              />
              {/* <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              /> */}
            </label>
          </div>
          <p className="image-upload-message" id="image-instruction">
            Click the camera icon to update photo
          </p>
          {/* <p className="text-sm text-zinc-400">
            {isUpdatingProfile
              ? "Uploading..."
              : "Click the camera icon to update photo"}
          </p> */}
        </figure>
        {/* Profile Info */}
        <div
          className="right"
          role="region"
          aria-label="Profile information section"
        >
          <div className="profile-content">
            {/* Name */}
            <div className="profile-row" role="group">
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
                      <FaCheck aria-hidden="true" />
                    </button>
                    <button
                      className="edit-icon cancel"
                      onClick={cancelEditing}
                      aria-label="Cancel name change"
                    >
                      <FaTimes aria-hidden="true" />
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="profile-name">{name}</h3>
                    <button
                      className="edit-icon"
                      onClick={startEditing}
                      aria-label="Edit name"
                    >
                      <RiEditLine aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Gender */}
            <div className="profile-row" role="group" aria-label="gender-label">
              <label className="profile-label" id="gender-label">
                Gender
              </label>
              <div className="profile-info">
                {isEditingGender ? (
                  <>
                    <select
                      className="profile-select"
                      value={tempGender}
                      onChange={(e) => setTempGender(e.target.value)}
                      aria-label="Select gender"
                    >
                      <option value="">-</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <button
                      className="edit-icon confirm"
                      onClick={confirmGenderEdit}
                      aria-label="Confirm gender change"
                    >
                      <FaCheck aria-hidden="true" />
                    </button>
                    <button
                      className="edit-icon cancel"
                      onClick={cancelGenderEdit}
                      aria-label="Cancel gender change"
                    >
                      <FaTimes aria-hideen="true" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="profile-value">
                      {gender === "" ? "-" : gender}
                    </span>
                    <button
                      className="edit-icon"
                      onClick={startGenderEdit}
                      aria-label="Edit gender"
                    >
                      <RiEditLine aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="profile-row" role="group" aria-label="email-label">
              <label className="profile-label" id="email-label">
                Email
              </label>
              <div className="profile-info">
                <span className="profile-value">username@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
