"use client";

import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeleton/SidebarSkeleton";
import { useAuthStore } from "@/store/useAuthStore";
import profileImage from "../../public/profile.png";
import Image from "next/image";
import { X } from "lucide-react";

const Sidebar = () => {
  const [query, setQuery] = useState("");
  const { getUsers, users, selectedUser, setSelected, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, []);

  if (isUsersLoading || users.length === 0) return <SidebarSkeleton />;
  return (
    <div className="overflow-auto scroll-auto  p-8 gap-4  flex flex-col w-[400px] h-[630px] bg-linear-to-r from-black/20 to-black/20  rounded-4xl opacity-100 shadow-inner">
      <div
        className=" p-3 justify-center w-full  h-12 flex gap-[10px] rounded-[20px] bg-[#1a1a1a]
       bg-custom-gradient shadow-inner-custom drop-shadow-custom"
      >
        <input
          onChange={(e) => setQuery(e.target.value.toLowerCase())}
          value={query}
          type="text"
          placeholder="Search here........"
          className=" 
           p-2 placeholder:text-[18.2px] w-full h-full 
           gap-[203px] text-start opacity-100"
        />
        {!query && (
          <svg
            width="24"
            height="26"
            viewBox="0 0 24 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.5125 22.75C16.628 22.75 20.775 18.1422 20.775 12.4583C20.775 6.77436 16.628 2.16663 11.5125 2.16663C6.39696 2.16663 2.25 6.77436 2.25 12.4583C2.25 18.1422 6.39696 22.75 11.5125 22.75Z"
              stroke="white"
              stroke-opacity="0.5"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              opacity="0.4"
              d="M21.75 23.8333L19.8 21.6666"
              stroke="#94919A"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
        {query && (
          <X
            onClick={() => {
              setQuery("");
            }}
          />
        )}
      </div>
      {users

        .filter(
          (name) =>
            typeof name.fullName === "string" &&
            name.fullName.toLowerCase().includes(query)
        )

        .map((name, index) => (
          <div key={index}>
            <div
              onClick={() => setSelected(name)}
              className="hover:bg-gray-800 w-full gap-[15px] flex h-[91px] pl-4 py-[13px] pr-[7px] rounded-[20px] bg-gradient-to-br from-black/[0.28] to-[#818181]/0 drop-shadow-2xl shadow-black-200/30 shadow-inner-custom  "
            >
              <Image
                className="rounded-full"
                alt="profile Image"
                src={name.profilePic || profileImage.src}
                height={65}
                width={65}
              />

              <div className="flex flex-col justify-center gap-1 w-full">
                <div className="flex items-center gap-3">
                  <h1 className="text-[20px]">{name.fullName}</h1>
                </div>
                <div className="flex justify-between pr-5 items-center">
                  <p className="text-[#76767C] text-sm">
                    hello bhai kaisa hai ???
                  </p>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      typeof name._id === "string" &&
                      onlineUsers.includes(name._id)
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
