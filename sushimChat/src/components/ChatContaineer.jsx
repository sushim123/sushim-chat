import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "../components/ChatHeader";
import MessageInput from "../components/MessageInput";
import MessageSkeleton from "../components/skeleton/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import profilePng from "../assets/profile.png";
import { formatMessageTime } from "../lib/utils.js";

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

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end " : "chat-start"
            } `}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border ">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || profilePng
                      : selectedUser.profilePic || profilePng
                  }
                  alt="profile Image"
                />
              </div>
            </div>
            <div className="chat-header mb-1 bg-[#F1F1F1] text-black">
              <time className="text-xs ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col bg-[#F1F1F1] text-black ${
                message.senderId === authUser._id
                  ? "bg-blue-500 text-white"
                  : "text-black"
              }`}
            >
              {message.image && (
                <img
                  src={message.image}
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContaineer;
