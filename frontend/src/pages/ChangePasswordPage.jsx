import "../styles/general/general.css";
import React, { useState } from "react";
import FormField from "../components/general/FormField";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authUser, changeNewPassword } = useAuthStore();
  // const changeNewPassword = useAuthStore((state) => state.changeNewPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("New password should be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    try {
      setIsSubmitting(true);
      await changeNewPassword(oldPassword, newPassword);
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Change password failed:", error);
      toast.error("Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="reset-password-page">
      <div className="form-group" align="center">
        <h1>Change New Password</h1>
        <form className="form" onSubmit={handleSubmit}>
          <FormField
            type="password"
            name="old_password"
            label="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <FormField
            type="password"
            name="new_password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <FormField
            type="password"
            name="confirm_password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <a id="forgotPwLink" href="/forgot_password">
            Forgot Password?
          </a>
          <button
            className="submitButton"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Confirm"}
          </button>
        </form>
        <p>
          Return to <a href="/profile">Profile</a>
        </p>
      </div>
    </main>
  );
};
export default ChangePasswordPage;
