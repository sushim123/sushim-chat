import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useEffect } from "react";

const ChatMessages = () => {
  const { selectedUser, messages, getMessages } = useChatStore();
  const { authUser } = useAuthStore();
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);
  if (!selectedUser) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Select a user to start chatting
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-[10px]">
      {messages?.map((message) => {
        const isSendByMe = message.senderId === authUser?._id;
        return (
          <div
            key={message._id}
            className={`w-fit max-w-[70%] text-white text-[18.2px] opacity-100 pl-4 pr-7 py-[13px] shadow-inner-custom h-full rounded-[30px] bg-custom-gradient drop-shadow-custom ${
              isSendByMe ? "self-end" : "self-start"
            }`}
          >
            {message.text}
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
