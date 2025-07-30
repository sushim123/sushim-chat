import { create } from "zustand";
import { axiosInstance, socketBaseURL } from "@/lib/axios"; // Assuming socketBaseURL is correctly defined here
import toast from "react-hot-toast";
import { io } from "socket.io-client";

type onlineUsers = {
  userIds: string[];
  selectedUser: { id: string }; // This type seems inconsistent with onlineUsers being just string[]
};

type AuthUser = {
  _id: string;
  fullName: string;
  profilePic: string;
  email: string;
  createdAt: Date;
  token?: string; // Added token to AuthUser type
};

export type SignUpAndLoginData = {
  email: string;
  password: string;
  fullName?: string;
};

type useAuthStoreInstance = {
  checkAuth?: () => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  signup?: (data: SignUpAndLoginData) => Promise<boolean>;
  login?: (data: SignUpAndLoginData) => Promise<boolean>;
  updateProfile?: (profilePic: string) => Promise<void>;
  updateFullName?: (fullName: string) => Promise<void> | undefined;
  authUser: AuthUser | null;
  token: string | null; // Explicitly added token to state
  isSigningUp: boolean;
  isloggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: string[]; // Changed to string[] as per your socket.on("getOnlineUsers")
  isCheckingAuth: boolean;
  socket: any | null;
  newMessage: any | null; // Changed to any for flexibility
  logout: () => Promise<void>;
};

export const useAuthStore = create<useAuthStoreInstance>((set, get) => ({
  authUser: null,
  token: null, // Initialize token as null
  isSigningUp: false,
  isloggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,
  newMessage: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true }); // Ensure loading state is set
    try {
      // axiosInstance should have an interceptor to add the Authorization header
      // If the backend sends the token in a cookie, axiosInstance might need withCredentials: true
      // but for Authorization header strategy, it's generally not needed for axiosInstance itself
      const res = await axiosInstance.get("/auth/check", {
        // withCredentials: true, // Remove if axiosInstance interceptor handles auth
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-store",
        },
      });
      console.log("checkAuth response from API:", res.data);

      // Assuming res.data contains the user object and potentially a new token
      set({ authUser: res.data, token: res.data.token || null }); // Store token from response
      get().connectSocket();
    } catch (error: any) {
      console.log("error in checkAuth function", { message: error.message });
      set({ authUser: null, token: null }); // Clear authUser and token on error
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignUpAndLoginData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      // Assuming res.data contains the user object and the JWT token
      set({ authUser: res.data, token: res.data.token }); // Store authUser and token
      toast.success("Account Created Successfully");
      get().connectSocket();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isloggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      // Assuming res.data contains the user object and the JWT token
      set({ authUser: res.data, token: res.data.token }); // Store authUser and token
      toast.success("Login Successfully");
      get().connectSocket();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      set({ isloggingIn: false });
    }
  },

  logout: async () => {
    try {
      // axiosInstance should have an interceptor to add the Authorization header
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, token: null }); // Clear authUser and token
      toast.success("Logout successfully");
      get().disconnectSocket();
      set({ socket: null });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.error("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // axiosInstance should have an interceptor to add the Authorization header
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Pic Updated Successfully");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while updating profile.";
      toast.error(message);
      console.error("Update profile error:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateFullName: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // axiosInstance should have an interceptor to add the Authorization header
      const res = await axiosInstance.put("/auth/update-fullname", data);
      set({ authUser: res.data });
      toast.success("Full Name updated Successfully");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update full name"
      );
      console.error("Update full name error:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser, socket } = get();
    // Only connect if authUser exists and socket is not already connected
    if (!authUser || socket?.connected) {
      console.log(
        "Socket connection skipped: No authUser or already connected."
      );
      return;
    }

    // Ensure socketBaseURL points to your Render backend's Socket.IO server (e.g., 'https://sushim-chat.onrender.com')
    const newSocket = io(socketBaseURL, {
      query: { userId: authUser._id },
      // If your Socket.IO handshake requires the JWT token, you might need to add it here:
      // auth: { token: get().token },
      // Or if it relies on cookies for handshake:
      // withCredentials: true,
    });

    newSocket.connect(); // Explicitly connect the socket
    set({ socket: newSocket });

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      console.log("Online users received:", userIds);
      set({ onlineUsers: userIds });
    });

    newSocket.on("newMessage", (newMessage: any) => {
      console.log("new message received from socket:", newMessage);
      set({ newMessage: newMessage });
    });

    newSocket.on("connect", () => {
      console.log("Socket.IO connected:", newSocket.id);
    });

    newSocket.on("disconnect", (reason: string) => {
      console.log("Socket.IO disconnected:", reason);
      // You might want to handle reconnection logic here if needed
    });

    newSocket.on("connect_error", (err: Error) => {
      console.error("Socket.IO connection error:", err.message, err.cause);
      toast.error(`Socket connection error: ${err.message}`);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      socket.disconnect();
      set({ socket: null, newMessage: null, onlineUsers: [] });
      console.log("Socket.IO disconnected successfully.");
    }
  },
}));
