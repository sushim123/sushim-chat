"use client";
import Sidebar from "@/components/sidebar";
import ChatContaineer from "@/components/ChatContainer";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
const Homepage = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    logout;
    router.push("/login");
  };
  return (
    <div className="h-screen w-screen bg-[#1D1C1C]">
      <div className="text-start flex flex-col p-10 h-[49px] ">
        <div className="flex text-[35px] justify-between ">
          <h1 className="text-[#F1F1F3] text-[35px]"> Sushim's Chat </h1>
          <div className="flex gap-6 text-white text-[18px] ">
            <div>Settings</div>
            <div
              onClick={() => {
                router.push("/profile");
              }}
            >
              {" "}
              Profile
            </div>
            <div onClick={handleLogout}>Logout</div>
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
