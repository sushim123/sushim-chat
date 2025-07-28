import { useAuthStore } from "@/store/useAuthStore";
import { useChatStore } from "@/store/useChatStore";
import { useEffect, useRef, useState } from "react";
import deleteIcon from "../../public/delete.svg";
import copyIcon from "../../public/copy.svg";
import forwardIcon from "../../public/forward.svg";
import pinIcon from "../../public/pin.svg";
import selectIcon from "../../public/select.svg";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { X } from "lucide-react";
const ChatMessages = () => {
  const { selectedUser, messages, getMessages, deleteMessage } = useChatStore();
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [showImage, setShowImage] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
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

  const handleRightClick = (e: React.MouseEvent, messageText: string) => {
    e.preventDefault();
    setClickPosition({ x: e.pageX, y: e.pageY });
    setSelectedMessage(messageText);
  };

  const handleMenuItemClick = async (label: string) => {
    setClickPosition(null);
    if (label === "Copy" && selectedMessage) {
      try {
        await navigator.clipboard.writeText(selectedMessage);
        toast.success(`Copied!... ${selectedMessage}`);
      } catch (error) {
        toast.error("Not Copied ! ");
      }
    }
    if (label === "Delete" && selectedMessageId) {
      try {
        await deleteMessage(selectedMessageId);
      } catch (error) {
        toast.error("Not Deleted ! ");
      }
    }
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
    <div className="flex flex-col gap-[10px]">
      {messages?.map((message) => {
        const isSendByMe = message.senderId === authUser?._id;
        return (
          <div
            onContextMenu={(e) => {
              handleRightClick(e, message.text);
              setSelectedMessageId(message._id);
            }}
            key={message._id}
            className={`w-fit max-w-[70%]  text-white text-[18.2px] opacity-100 px-4 py-[13px] shadow-inner-custom rounded-[30px] bg-custom-gradient relative ${
              isSendByMe ? "self-end" : "self-start"
            }`}
          >
            <p className="whitespace-pre-wrap  break-words leading-snug ">
              {message.text ||
                (message.image && (
                  <img
                    onClick={() => {
                      setShowImage(true);
                      setImagePath(message.image);
                    }}
                    className="h-45"
                    src={message.image}
                  />
                ))}
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
      <AnimatePresence>
        {clickPosition && (
          <motion.ul
            key={`${clickPosition.x}-${clickPosition.y}`}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            onClick={handleCLick}
            className="absolute bg-[#060606]  shadow-inner-custom rounded-[18px] w-fit h-fit px-[20px] py-[13px] text-black z-50"
            style={{
              top: clickPosition.y,
              left: clickPosition.x,
            }}
          >
            <div className="gap-[21px] flex flex-col">
              {menuItems.map((item) => (
                <div
                  onClick={() => handleMenuItemClick(item.label)}
                  key={item.label}
                  className="flex gap-2 text-2xl items-center hover:bg-gray-600"
                >
                  <img src={item.icon.src} />
                  <li className="text-white ">{item.label}</li>
                </div>
              ))}
            </div>
          </motion.ul>
        )}

        {showImage && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center z-[999]">
            <img
              src={imagePath!}
              className="max-w-[90%] max-h-[90%] rounded-xl shadow-xl transition-transform duration-300"
            />
            <X
              className="absolute top-10 right-30"
              onClick={() => setShowImage(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatMessages;
