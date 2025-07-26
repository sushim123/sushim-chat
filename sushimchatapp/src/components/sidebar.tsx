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
              className="hover:bg-gray-800 w-full gap-[15px] flex h-[91px] pl-4 py-[13px] pr-[7px] rounded-[20px] bg-gradient-to-br from-black/[0.28] to-[#818181]/0 drop-shadow-2xl shadow-black-200/30 shadow-inner "
            >
              <Image
                className="rounded-full"
                alt="profile Image"
                src={name.profilePic || profileImage.src}
                height={65}
                width={65}
              />

              <div className="flex gap-2.5 h-full w-full flex-col ">
                <h1 className="h-[27px] w-[125px] text-[20px]">
                  {name.fullName}
                </h1>
                <p className="text-[#76767C] text-sm">
                  hello bhai kaisa hai ???
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;
