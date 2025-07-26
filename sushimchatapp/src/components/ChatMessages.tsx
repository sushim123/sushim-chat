import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useRef } from "react";

const ChatMessages = () => {
  const { selectedUser, messages, getMessages } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-[10px]">
      {messages?.map((message) => {
        const isSendByMe = message.senderId === authUser?._id;
        return (
          <div
            key={message._id}
            className={`w-fit max-w-[70%]  text-white text-[18.2px] opacity-100 px-4 py-[13px] shadow-inner-custom rounded-[30px] bg-custom-gradient relative ${
              isSendByMe ? "self-end" : "self-start"
            }`}
          >
            <p className="whitespace-pre-wrap  break-words leading-snug ">
              {message.text}
              <span className="text-[10px] text-white/50  pl-3">
                {new Date(message.createdAt).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                  timeZone: "Asia/Kolkata",
                })}
              </span>
            </p>
          </div>
        );
      })}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ChatMessages;
