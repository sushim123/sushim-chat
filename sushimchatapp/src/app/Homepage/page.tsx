"use client";
import Sidebar from "@/components/sidebar";
import ChatContaineer from "@/components/ChatContainer";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Homepage = () => {
  const { logout, authUser } = useAuthStore();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [activeChat, setActiveChat] = useState(false);
  useEffect(() => {
    if (!authUser) {
      router.push("/login");
    }
  }, [authUser, router]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="h-full w-full bg-[#1D1C1C]">
      <div className="flex sm:flex-row flex-col gap-2 justify-between items-center p-6">
        <h1 className="text-[#F1F1F3] text-[35px]">Sushim's Chat</h1>
        <div className="flex gap-6 text-white text-[18px]">
          <motion.div whileHover={{ scale: 1.2 }}>Settings</motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            onClick={() => router.push("/profile")}
          >
            Profile
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            onClick={() => router.push("/contactme")}
          >
            Contact Me
          </motion.div>
          <motion.div whileHover={{ scale: 1.2 }} onClick={handleLogout}>
            Logout
          </motion.div>
        </div>
      </div>

      <div className="flex flex-1 h-full gap-8 overflow-hidden sm:px-6 px-2 pb-6">
        {isMobile ? (
          activeChat ? (
            <ChatContaineer goBack={() => setActiveChat(false)} />
          ) : (
            <Sidebar onChatSelect={() => setActiveChat(true)} />
          )
        ) : (
          <>
            <Sidebar onChatSelect={() => setActiveChat(true)} />
            <ChatContaineer goBack={() => setActiveChat(false)} />
          </>
        )}
      </div>
    </div>
  );
};

export default Homepage;
