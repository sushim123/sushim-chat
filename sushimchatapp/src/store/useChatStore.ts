import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios"; // Assuming axiosInstance is configured for auth
import { useAuthStore } from "./useAuthStore"; // To get the JWT token and socket instance
import axios, { AxiosError } from "axios";

interface selectedUser {
  _id: string | null; // Changed to string as _id is typically a string
  profilePic: string;
  fullName: string;
}

interface User {
  profilePic: string;
  name: string;
  _id: string | null; // Changed to string
  fullName: string;
}
type ChatStore = {
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  isUsersLoading: boolean;
  users: User[];
  isMessagesLoading: boolean;
  messages?: any[] | null | undefined;
  sendMessage: (messageData: any) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  setSelected: (selectedUser: selectedUser | null) => Promise<void>;
  selectedUser: selectedUser | null;
};
export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      // axiosInstance should be configured with an interceptor to add the Authorization header
      const res = await axiosInstance.get("/message/getuser");
      set({ users: res.data });
      toast.success("All users are loaded successfully");
    } catch (error) {
      toast.error(
        (error as any).response?.data?.message || "Failed to load users."
      );
      console.error("Get users error:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      // axiosInstance should be configured with an interceptor to add the Authorization header
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
      toast.success("Message Loaded successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load messages.");
      console.error("Get messages error:", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      if (!selectedUser?._id) {
        console.error("❌ Selected user is missing or invalid");
        toast.error("No user selected to send message.");
        return;
      }

      // Get the token from useAuthStore (assuming it's stored there after login)
      const authState = useAuthStore.getState();
      const token = authState.token; // Assuming 'token' is the JWT in your auth store

      if (!token) {
        console.error("❌ Authentication token not found in auth store.");
        toast.error("Authentication required. Please log in.");
        return;
      }

      const url = `https://sushim-chat.onrender.com/api/message/send/${selectedUser._id}`;

      let res;
      try {
        res = await axios.post(url, messageData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send JWT in Authorization header
          },
          // withCredentials is NOT needed when sending token in Authorization header
          // withCredentials: true,
        });
      } catch (err) {
        // Removed the fallback to url2 as it's incorrect for production deployment
        const AxiosError = err as AxiosError;
        toast.error("Failed to send message.");
        console.error(
          "Send message Axios error:",
          AxiosError.message,
          AxiosError.response?.data
        );
        throw err; // Re-throw to be caught by outer catch
      }

      set({ messages: [...(messages ?? []), res.data] });
      toast.success("Message sent!"); // Add success toast for clarity
    } catch (error: any) {
      // This catch will handle errors from token absence or the axios.post itself
      toast.error(error.response?.data?.message || "Failed to send message.");
      console.error("Send message error:", error.message);
    }
  },

  deleteMessage: async (messageId: string) => {
    const { messages } = get();
    try {
      // axiosInstance should be configured with an interceptor to add the Authorization header
      await axiosInstance.delete(`/message/delete/${messageId}`);
      const updatedMessages = (messages ?? []).filter(
        (msg) => msg._id !== messageId
      );
      set({ messages: updatedMessages });
      toast.success("Message deleted successfully.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Message Not deleted");
      console.error("Delete message error:", error);
    }
  },

  subscribeToMessages: () => {
    const socket = (useAuthStore.getState() as { socket: any }).socket;
    if (!socket) {
      console.warn("Socket.IO client not initialized in useAuthStore.");
      return;
    }

    socket.off("newMessage"); // Ensure no duplicate listeners

    socket.on("newMessage", (newMessage: any) => {
      // Type as any for flexibility
      const current = get().messages;
      console.log("new message received:", newMessage); // 🔍 Check this in browser console
      set({ messages: [...(current ?? []), newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = (useAuthStore.getState() as { socket: any }).socket;
    if (socket) {
      socket.off("newMessage");
    }
  },

  setSelected: async (selectedUser) => {
    if (selectedUser) {
      set({ selectedUser });
      if (selectedUser._id) {
        // profilePic check is not strictly needed for getMessages
        await get().getMessages(selectedUser._id);
      }
    } else {
      set({ selectedUser: null });
      set({ messages: [] }); // Clear messages when no user is selected
    }
  },
}));
