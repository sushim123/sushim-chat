import React, { useRef, useState } from "react";
import { useChatStore } from "@/store/useChatStore";
import { Image, Send, Smile, X } from "lucide-react";
import toast from "react-hot-toast";
import EmojiPicker from "emoji-picker-react";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChatStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send mesage", error);
    }
  };
  const handleEmojiClick = (emojiData: any) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview || undefined}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
            flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="text-gray-500 hover:text-white"
        >
          <Smile />
        </button>

        <div className="flex-1 items-center flex gap-2">
          <input
            type="text"
            className=" text-[#FFFFFF] placeholder:text-[#FFFFFF]/50 placeholder:text-[18.5px] w-full p-4 
            input input-bordered rounded-2xl
             ed-[30px] input-sm sm:input-md
              bg-custom-gradient shadow-inner-custom drop-shadow-custom"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                   ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle text-red-500"
          disabled={!text.trim() && !imagePreview}
        >
          <svg
            width="28"
            height="24"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.8219 0.56917C26.6766 0.443742 26.4999 0.360324 26.3108 0.327903C26.1216 0.295482 25.9272 0.315288 25.7485 0.385185L1.99924 9.67933C1.66266 9.81021 1.37771 10.0469 1.18728 10.3537C0.996848 10.6606 0.911252 11.021 0.943375 11.3807C0.975498 11.7404 1.1236 12.0799 1.36539 12.3481C1.60718 12.6164 1.92956 12.7988 2.28401 12.868L8.43752 14.0762V20.9375C8.43631 21.3113 8.54737 21.6767 8.75632 21.9866C8.96527 22.2965 9.26246 22.5364 9.6094 22.6754C9.95579 22.8169 10.3367 22.8508 10.7027 22.7729C11.0686 22.6949 11.4027 22.5087 11.6614 22.2383L14.6285 19.161L19.336 23.2813C19.6756 23.5825 20.1136 23.7492 20.5676 23.75C20.7665 23.7499 20.9642 23.7186 21.1535 23.6575C21.4629 23.5593 21.7411 23.3818 21.9604 23.1427C22.1798 22.9036 22.3327 22.6112 22.4039 22.2946L27.1606 1.60159C27.2031 1.41497 27.1941 1.22029 27.1344 1.03841C27.0748 0.856537 26.9667 0.694327 26.8219 0.56917ZM19.6571 4.78792L9.15823 12.3067L3.34572 11.1664L19.6571 4.78792ZM10.3125 20.9375V15.3735L13.2176 17.9211L10.3125 20.9375ZM20.5699 21.875L10.8809 13.3789L24.8262 3.38401L20.5699 21.875Z"
              fill="#8D8D8D"
            />
          </svg>
        </button>
        {showEmojiPicker && (
          <div className="absolute top-65">
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageInput;
