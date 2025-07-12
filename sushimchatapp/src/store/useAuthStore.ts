import { create } from "zustand";
import { axiosInstance,  } from "@/lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
type onlineUsers = {
  userIds: string[];
  selectedUser: { id: string };
};

type AuthUser = {
  _id: string;
  fullName: string;
  profilePic: string;
  email: string;
  createdAt: Date;
};

export type SignUpAndLoginData = {
  email: string;
  password: string;
  fullName?: string;
};

type useAuthStoreInstance = {
  checkAuth?: () => Promise<void>;
  // connectSocket: () => void;
  // disconnectSocket: () => void;
  signup?: (data: SignUpAndLoginData) => Promise<boolean>;
  login?: (data: SignUpAndLoginData) => Promise<boolean>;
  updateProfile?: (profilePic: string) => Promise<void>;
  updateFullName?: (fullName: string) => Promise<void> | undefined;
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isloggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: onlineUsers[];
  isCheckingAuth: boolean;
  socket: any | null;
  logout: () => Promise<void>;
};
export const useAuthStore = create<useAuthStoreInstance>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isloggingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check", {
        withCredentials: true,

        headers: {
          Accept: "application/json",
          "Cache-Control": "no-store",
        },
      });
      console.log("checkAuth response from API:", res.data);

      set({ authUser: res.data });
      // get().connectSocket();
    } catch (error: any) {
      console.log("error in checkAuth function", { message: error.message });
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data: SignUpAndLoginData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      set({ authUser: res.data });
      toast.success("Account Created Successfully");
      // get().connectSocket();
      return true;
    } catch (error: any) {
      toast.error(error.response.data.message);
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isloggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Login Successfully");
      // get().connectSocket();
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
      set({ authUser: null });
      toast.success("Logout successfully");
      // get().disconnectSocket();
      set({ socket: null });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile Pic Updated Sucessfully");
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Something went wrong while updating profile.";
      toast.error(message);
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
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // connectSocket: async () => {
  //   const { authUser } = get();
  //   if (!authUser || get().socket?.connected) return;

  //   const socket = io(BASE_URL, {
  //     query: {
  //       userId: authUser._id,
  //     },
  //   });
  //   socket.connect();
  //   set({ socket: socket });

  //   socket.on("getOnlineUsers", (userIds) => {
  //     set({ onlineUsers: userIds });
  //   });
  // },
  // disconnectSocket: async () => {
  //   if (get().socket.connected) {
  //     get().socket.disconnect();
  //   }
  // },
}));
