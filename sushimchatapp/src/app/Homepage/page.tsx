"use client";
import { useChatStore } from "@/store/useChatStore";
import Sidebar from "@/components/sidebar";
// import NoChatSelected from "@/components/NoChatSelected";
import ChatContaineer from "@/components/ChatContainer";
const Homepage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="h-screen w-screen bg-[#1D1C1C]">
      <div className="text-start flex flex-col p-10 h-[49px] ">
        <h1 className="text-[#F1F1F3] text-[35px]"> Sushim's Chat </h1>
        <div className="flex gap-8">
          <Sidebar />
          <ChatContaineer />
        </div>
      </div>
    </div>
  );
};
export default Homepage;
