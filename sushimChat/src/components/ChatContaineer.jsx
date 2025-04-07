import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";

const ChatContaineer = () => {
  const { messages, isMessagesLoading, getMessages, selectedUser } =
    useChatStore();
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <p>messages...</p>
      <MessageInput />
    </div>
  );
};

export default ChatContaineer;
