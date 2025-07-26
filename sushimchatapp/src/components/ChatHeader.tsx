import { Dot, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import profileImage from "../../public/profile.png";

const ChatHeader = () => {
  const { selectedUser, setSelected } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return selectedUser ? (
    <div className="p-2.5 px-8 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                className="rounded-full"
                src={selectedUser?.profilePic || profileImage.src}
                alt={selectedUser?.fullName}
              />
            </div>
          </div>

          <div>
            <h3 className=" pl-6 font-medium">
              {selectedUser?.fullName || "sushim"}
            </h3>
            <div className="flex">
              {selectedUser?._id && onlineUsers.includes(selectedUser?._id) ? (
                <Dot className="text-green-600" />
              ) : (
                <Dot className="text-red-600 " />
              )}
              <p className="text-sm text-base-content/70">
                {selectedUser?._id && onlineUsers.includes(selectedUser?._id)
                  ? "Online"
                  : "offline"}
              </p>{" "}
            </div>
          </div>
        </div>

        <button onClick={() => setSelected(null)}>
          <X />
        </button>
      </div>
    </div>
  ) : (
    <div className="text-center mt-10 text-gray-400">Select a User First</div>
  );
};
export default ChatHeader;
