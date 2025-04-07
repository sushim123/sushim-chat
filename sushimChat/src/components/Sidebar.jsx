import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "../components/skeleton/SidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelected, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="h-full w-20 lg:w-72   border-r border-gray-300  flex flex-col items-center lg:items-start py-4 px-2 lg:px-4">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6 " />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="overflow-y-auto w-full py-3"></div>
      </div>
      {users.map((user) => (
        <button
          key={user._id}
          onClick={() => setSelected(user)}
          className={`
              w-full p-3 flex items-center gap-3
              hover:bg-red-500 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-red-600 ring-1 ring-base-300"
                  : ""
              }
            `}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user.profilePic}
              alt={user.name}
              className="size-12 object-cover rounded-full"
            />
            {onlineUsers.includes(user._id) && (
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
              />
            )}
          </div>
          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user.fullName}</div>
            <div className="text-sm text-zinc-400">
              {onlineUsers.includes(user._id) ? "Online" : "Offline"}
            </div>
          </div>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
