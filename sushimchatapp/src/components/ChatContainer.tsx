"use client";

import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "@/components/ChatHeader";
import MessageInput from "@/components/MessageInput";
import MessageSkeleton from "@/components/skeleton/MessageSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import profilePng from "../../public/profile.png";
import ChatMessages from "./ChatMessages";

const ChatContaineer = () => {
  const { authUser } = useAuthStore();
  const {
    messages,
    isMessagesLoading,
    getMessages,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  // useEffect(() => {
  //   if (selectedUser && selectedUser._id) {
  //     getMessages(selectedUser._id);
  //     subscribeToMessages();
  //   }
  //   return () => unsubscribeFromMessages();
  // }, [
  //   selectedUser?._id,
  //   getMessages,
  //   subscribeToMessages,
  //   unsubscribeFromMessages,
  // ]);

  // if (isMessagesLoading) {
  //   return (
  //     <div className="flex-1 flex flex-col overflow-auto">
  //       {/* <ChatHeader />
  //       <MessageSkeleton />
  //       <MessageInput /> */}
  //     </div>
  //   );
  // }

  return (
    <div className=" opacity-100">
      <div className=" flex flex-col w-[1028px] h-[630px] rounded-4xl bg-gradient-to-r from-[#000000]/20 to-[#000000]/20 shadow-inner/10">
        <div className="shrink-0">
          <ChatHeader />
        </div>

        <div className="flex-1 overflow-auto px-4 py-2">
          {selectedUser ? <ChatMessages /> : ""}
        </div>

        <div className="shrink-0">{selectedUser ? <MessageInput /> : ""}</div>
      </div>
    </div>
  );
};

export default ChatContaineer;
