import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useRef, useState } from "react";
import deleteIcon from "../../public/delete.svg";
import copyIcon from "../../public/copy.svg";
import forwardIcon from "../../public/forward.svg";
import pinIcon from "../../public/pin.svg";
import selectIcon from "../../public/select.svg";
const ChatMessages = () => {
  const { selectedUser, messages, getMessages } = useChatStore();
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const menuItems = [
    {
      label: "Delete",
      icon: deleteIcon,
    },
    {
      label: "Copy",
      icon: copyIcon,
    },
    {
      label: "Forward",
      icon: forwardIcon,
    },
    {
      label: "Pin",
      icon: pinIcon,
    },
    {
      label: "Select",
      icon: selectIcon,
    },
  ];

  const { authUser } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setClickPosition({ x: e.pageX, y: e.pageY });
  };

  const handleCLick = () => {
    setClickPosition(null);
  };
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser, getMessages]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-[10px]" >
      {messages?.map((message) => {
        const isSendByMe = message.senderId === authUser?._id;
        return (
          <div
            onContextMenu={handleRightClick}
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
      {clickPosition && (
        <ul
          onClick={handleCLick}
          className="absolute  bg-[#060606]  shadow-inner-custom rounded-[18px] w-fit h-fit px-[20px] py-[13px] text-black z-50"
          style={{
            top: clickPosition.y,
            left: clickPosition.x,
          }}
        >
          <div className="gap-[21px] flex flex-col">
            {menuItems.map((item) => (
              <div
                key={item.label}
                className="flex gap-2 text-2xl items-center"
              >
                <img src={item.icon.src} />
                <li className="text-white">{item.label}</li>
              </div>
            ))}
          </div>
        </ul>
      )}
    </div>
  );
};

export default ChatMessages;
