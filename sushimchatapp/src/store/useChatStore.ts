import { create } from "zustand";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface selectedUser {
  _id: null;
  profilePic: string;
  fullName: string;
}

interface User {
  profilePic: string;
  name: string;
  _id: null;
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
      const res = await axiosInstance.get("/message/getuser");

      set({ users: res.data });

      toast.success("All users are loaded successfully");
    } catch (error) {
      toast.error((error as any).response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${userId}`);
      set({ messages: res.data });
      toast.success("Message Loaded succesfully");
    } catch (error: any) {
      toast.error(error.response.data.message);
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

      const res = await axiosInstance.post(
        `/message/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: [...(messages ?? []), res.data] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const socket = (useAuthStore.getState() as { socket: any }).socket;
    if (!socket) return;

    socket.off("newMessage");

    socket.on("newMessage", (newMessage: string) => {
      const current = get().messages;
      console.log("new message recived:", newMessage); // 🔍 Check this
      set({ messages: [...(current ?? []), newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = (useAuthStore.getState() as { socket: any }).socket;
    socket.off("newMessage");
  },

  setSelected: async (selectedUser) => {
    if (selectedUser) {
      set({ selectedUser });
      if (selectedUser._id && selectedUser.profilePic) {
        await get().getMessages(selectedUser._id);
      }
    } else {
      set({ selectedUser: null });
    }
  },
}));
