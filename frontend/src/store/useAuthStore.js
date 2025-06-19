import { create } from "zustand"; //state management
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isAuthChecked: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true, isAuthChecked: false });

    const token = localStorage.getItem("token");
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data, isCheckingAuth: false });
      // get().connectSocket();
    } catch (error) {
      console.error("Error in checking auth:", error);
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      set({ authUser: null, isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false, isAuthChecked: true });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      //   const res = await axiosInstance.post("/auth/signup", data);
      const res = await axiosInstance.post("/auth/signup", {
        name: data.name, // Use 'name' instead of 'fullName'
        email: data.email,
        password: data.password,
      });
      console.log("Signup response:", res.data);
      const { token } = res.data;
      // localStorage.setItem("token", token);
      // axiosInstance.defaults.headers.common[
      //   "Authorization"
      // ] = `Bearer ${token}`;

      // await get().checkAuth();
      // console.log("Before setting authUser:", get().authUser);
      // set({ authUser: res.data });
      // console.log("After setting authUser:", get().authUser);

      toast.success("Signup successful!");
      //   get().connectSocket();
      return get().authUser; // Return the response data
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response.data.message);
      throw error; // Re-throw the error so the UI can handle it
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    console.error("Logging in");
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      console.log("Login response:", res.data);

      const { token } = res.data;
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      await get().checkAuth();
      // console.log("Before setting authUser:", get().authUser);
      // set({ authUser: res.data });
      // console.log("After setting authUser:", get().authUser);
      toast.success("Login successful!");
      // get().connectSocket(); // connect to socket after successful login
      return res.data;
    } catch (error) {
      // console.error("Login error:", error.response?.data);
      // toast.error(error.response?.data?.message || "Login failed");
      // throw error;
      console.error("Login error:", error.response?.data);

      const status = error.response?.status;
      const serverMessage = error.response?.data?.message;

      let userMessage = "Login failed. Please try again.";
      if (status === 400) {
        userMessage = serverMessage || "Invalid email or password.";
      } else if (status === 500) {
        userMessage = "Server error. Please try again later.";
      }

      toast.error(userMessage);
      throw new Error(userMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const userId = get().authUser?._id;
      if (!userId) throw new Error("User ID not found");

      const res = await axiosInstance.put(`users/${userId}`, data);
      set({ authUser: res.data });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");

      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];

      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    // if (!authUser || get().socket?.connected) return;

    // const socket = io(BASE_URL, {
    //   query: {
    //     userId: authUser._id,
    //   },
    // });
    // socket.connect();

    // set({ socket: socket });

    // socket.on("getOnlineUsers", (userIds) => {
    //   set({ onlineUsers: userIds });
    // });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  deleteAccount: async () => {
    try {
      const userId = get().authUser?._id;
      if (!userId) throw new Error("User ID not found");

      await axiosInstance.delete(`users/${userId}`);
      set({ authUser: null });
      toast.success("Account deleted successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error?.response?.data?.message || "Account deletion failed");
    }
  },

  fetchLikedGenres: async (passedUserId) => {
    const userId = get().authUser?._id || passedUserId;
    console.log("Final userId used:", userId);
    if (!userId) {
      toast.error("User not logged in");
      return [];
    }

    try {
      const res = await axiosInstance.get(`/users/${userId}/liked-genres`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch liked genres:", error);
      toast.error("Failed to load genre statistics");
      return [];
    }
  },

  fetchReviewGenres: async (passedUserId) => {
    const userId = get().authUser?._id;
    console.log("Final userId used:", userId);
    if (!userId) {
      toast.error("User not logged in");
      return [];
    }

    try {
      const res = await axiosInstance.get(`/users/${userId}/review-genres`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch review genres:", error);
      toast.error("Failed to load genre statistics");
      return [];
    }
  },
  fetchWatchlistGenres: async (passedUserId) => {
    const userId = get().authUser?._id;
    console.log("Final userId used testing:", userId);
    if (!userId) {
      toast.error("User not logged in");
      return [];
    }

    try {
      const res = await axiosInstance.get(`/users/${userId}/watchlist-genres`);
      return res.data;
    } catch (error) {
      console.error("Failed to fetch watchlist genres:", error);
      toast.error("Failed to load genre statistics");
      return [];
    }
  },

  changeNewPassword: async (oldPassword, newPassword) => {
    try {
      const userId = get().authUser?._id;
      console.log("Final userId used for password change:", userId);
      if (!userId) {
        toast.error("User not logged in");
        return;
      }

      const res = await axiosInstance.put(`/users/change-password`, {
        oldPassword,
        newPassword,
      });

      toast.success("Password changed successfully");
      return res.data;
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
      throw error;
    }
  },

  updateFavouriteGenres: async (genreSelected) => {
    // set({ isUpdatingProfile: true });
    try {
      const userId = get().authUser?._id;
      if (!userId) throw new Error("User ID not found");

      const res = await axiosInstance.put(`/users/${userId}/favourite-genres`, {
        favouriteGenres: genreSelected,
      });
      set({ authUser: res.data });

      toast.success("Favourite genres saved successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while saving favourite genres"
      );
    }
  },
  updateFavouriteGenres: async (genreSelected) => {
    // set({ isUpdatingProfile: true });
    try {
      const userId = get().authUser?._id;
      if (!userId) throw new Error("User ID not found");

      const res = await axiosInstance.put(`/users/${userId}/favourite-genres`, {
        favouriteGenres: genreSelected,
      });
      set({ authUser: res.data });

      toast.success("Favourite genres saved successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while saving favourite genres"
      );
    }
  },

  requestResetCode: async (email) => {
    // set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.post(`/auth/request-reset-code`, {
        email: email,
      });
      toast.success("Verification code sent successfully.\nCheck your email");

      return res.data;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error sending verification code"
      );
      return null;
    }
  },

  verifyResetCode: async (email, code) => {
    try {
      const res = await axiosInstance.post("/auth/verify-reset-code", {
        email: email,
        code: code,
      });
      toast.success("Code verified successfully");
      return res;
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error sending verification code"
      );
      return null;
    }
  },

  resetPassword: async (email, code, newPassword, newPasswordConfirm) => {
    try {
      const res = await axiosInstance.post(`/auth/reset-password`, {
        email: email,
        code: code,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
      });

      toast.success("Password changed successfully");
      return res.data;
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
      return null;
    }
  },
}));
