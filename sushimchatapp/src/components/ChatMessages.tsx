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
  const {
    selectedUser,
    messages,
    getMessages,
    deleteMessage,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [selectedPinMessage, setSelectedPinMessage] = useState<string | null>(
    null
  );
  const [selectedSelectMessage, setSelectedSelectMessage] = useState<string[]>(
    []
  );

  const [showImage, setShowImage] = useState(false);
  const [imagePath, setImagePath] = useState<string | null>(null);
  const { authUser, connectSocket } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement | null>(null);
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
      label: selectedPinMessage ? "Unpin" : "Pin",
      icon: pinIcon,
    },
    {
      label:
        selectedMessageId && selectedSelectMessage.includes(selectedMessageId)
          ? "DisSelect"
          : "Select",
      icon: selectIcon,
    },
  ];

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
    if (label === "Delete") {
      const idsToDelete =
        selectedSelectMessage.length > 0
          ? selectedSelectMessage
          : selectedMessageId
          ? [selectedMessageId]
          : [];

      for (const id of idsToDelete) {
        try {
          await deleteMessage(id);
        } catch (error) {
          toast.error("Failed to delete some messages.");
        }
      }

      setSelectedSelectMessage([]);
    }
    if (label === "Pin" && selectedMessage) {
      setSelectedPinMessage(selectedMessage);
    }
    if (label === "Unpin" && selectedMessage) {
      setSelectedPinMessage(null);
    }
    if (label === "Select" && selectedMessageId) {
      setSelectedSelectMessage((prev) =>
        prev.includes(selectedMessageId)
          ? prev.filter((id) => id !== selectedMessageId)
          : [...prev, selectedMessageId]
      );
    }
    if (label === "DisSelect") {
      setSelectedSelectMessage([]);
    }
  };
  const handleCLick = () => {
    setClickPosition(null);
  };
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id);
      setSelectedPinMessage(null);
      setClickPosition(null);
      setSelectedSelectMessage([]);
    }
  }, [selectedUser, getMessages]);
  useEffect(() => {
    if (authUser) {
      connectSocket();
    }
  }, [authUser]);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  useEffect(() => {
    subscribeToMessages();
    return () => {
      unsubscribeFromMessages();
    };
  }, []);

  return (
    <div className="flex flex-col gap-[10px]">
      {selectedSelectMessage.length > 0 && (
        <div className="h-[91px] items-center justify-between flex w-full text-white text-[18.2px] opacity-100 py-[20px] px-[13px] shadow-inner-custom rounded-[20px] bg-custom-gradient relative">
          <div>{selectedSelectMessage.length} selected</div>
          <div className="flex justify-start gap-12">
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={() => handleMenuItemClick(item.label)}
                className="cursor-pointer"
              >
                <img src={item.icon.src} />
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedPinMessage && (
        <div className="h-10 w-full bg-gray-600 items-center justify-center flex">
          <h1>{selectedPinMessage}</h1>
        </div>
      )}

      {messages?.map((message) => {
        const isSelected = selectedSelectMessage.includes(message._id);
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
            } ${isSelected ? "border-2 border-blue-400" : ""}`}
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
