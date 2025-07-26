"use client";
import { useChatStore } from "@/store/useChatStore";
import Sidebar from "@/components/sidebar";
// import NoChatSelected from "@/components/NoChatSelected";
import ChatContaineer from "@/components/ChatContainer";
import ProfilePage from "../profile/page";
import { useRouter } from "next/navigation";
const Homepage = () => {
  const { selectedUser } = useChatStore();
  const router = useRouter();
  return (
    <div className="h-screen w-screen bg-[#1D1C1C]">
      <div className="text-start flex flex-col p-10 h-[49px] ">
        <div className="flex text-[35px] justify-between ">
          <h1 className="text-[#F1F1F3] text-[35px]"> Sushim's Chat </h1>
          <div className="flex gap-6 text-white text-[18px] ">
            <div>Settings</div>
            <div  onClick={()=> {router.push("/profile")}}> Profile</div>
            <div>Logout</div>
          </div>
        </div>

        <div className="flex gap-8">
          <Sidebar />
          <ChatContaineer />
        </div>
      </div>
    </div>
  );
};
export default Homepage;
