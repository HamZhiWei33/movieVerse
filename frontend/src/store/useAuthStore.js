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
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Error in checking auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
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
      set({ authUser: res.data });
      toast.success("Signup successful!");
      //   get().connectSocket();
      return res.data; // Return the response data
    } catch (error) {
      console.error("Signup error:", error.response?.data);
      toast.error(error.response.data.message);
      throw error; // Re-throw the error so the UI can handle it
    } finally {
      set({ isSigningUp: false });
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
}));
