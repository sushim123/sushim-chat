import { create } from "zustand";
import { axiosInstance, socketBaseURL } from "@/lib/axios"; 
import toast from "react-hot-toast";
import { io } from "socket.io-client";

type onlineUsers = {
  userIds: string[];
  selectedUser: { id: string }; 
}
type AuthUser = {
  _id: string;
  fullName: string;
  profilePic: string;
  email: string;
  createdAt: Date;
  token?: string; 
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
  token: string | null; 
  isSigningUp: boolean;
  isloggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: string[]; 
  isCheckingAuth: boolean;
  socket: any | null;
  newMessage: any | null; 
  logout: () => Promise<void>;
};

export const useAuthStore = create<useAuthStoreInstance>((set, get) => ({
  authUser: null,
  token: null,
  isSigningUp: false,
  isloggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,
  newMessage: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true }); 
    try {
      const res = await axiosInstance.get("/auth/check", {
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-store",
        },
      });
      console.log("checkAuth response from API:", res.data);
      set({ authUser: res.data, token: res.data.token || null });
      get().connectSocket();
    } catch (error: any) {
      console.log("error in checkAuth function", { message: error.message });
      set({ authUser: null, token: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignUpAndLoginData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data, token: res.data.token });
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
      set({ authUser: res.data, token: res.data.token }); 
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
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, token: null });
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
    if (!authUser || socket?.connected) {
      console.log(
        "Socket connection skipped: No authUser or already connected."
      );
      return;
    }
    const newSocket = io(socketBaseURL, {
      query: { userId: authUser._id },
    });
    newSocket.connect();
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
