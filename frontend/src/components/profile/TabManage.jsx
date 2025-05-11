import React from "react";
import "../../styles/profile/tab-manage.css";
import { useNavigate } from "react-router-dom";

const TabManage = () => {
  const navigate = useNavigate();

  const handlePasswordChange = () => {
    navigate("/forgot_password");
  };

  const handleAccountDelete = () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmation) {
      alert("Account deletion confirmed.");
      console.log("Account deletion confirmed");
    }
  };
  return (
    <section
      className="manage-section"
      aria-label="profile-manage"
      role="region"
    >
      <ul className="manage-container" aria-label="manage-lists">
        <li className="manage-item" aria-labelledby="change-password">
          <button
            type="button"
            className="btn-change-password"
            id="change-password"
            onClick={handlePasswordChange}
          >
            Change Password
          </button>
        </li>
        <li className="manage-item" aria-labelledby="delete-account">
          <button
            type="button"
            className="btn-delete-account"
            id="delete-account"
            aria-describedby="delete-warning"
            onClick={handleAccountDelete}
          >
            Delete Account
            <span id="delete-warning" className="sr-only">
              Warning: This action cannot be undone
            </span>
          </button>
        </li>
      </ul>
    </section>
  );
};

export default TabManage;
