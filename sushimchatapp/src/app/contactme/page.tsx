"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ContactMePage = () => {
  const { logout } = useAuthStore();
  const router = useRouter();
  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-start overflow-x-hidden text-white">
      {/* Header */}
      <div className="w-full pt-8 px-6 md:px-10 flex justify-between items-center">
        <h1
          onClick={() => router.push("/Homepage")}
          className="text-[#F1F1F3] text-[28px] md:text-[35px] font-bold"
        >
          Sushim's Chat
        </h1>
        <div className="flex gap-6 text-[16px] md:text-[18px]">
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer"
            onClick={() => router.push("/Homepage")}
          >
            Homepage
          </motion.div>
          {/* <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
            Settings
          </motion.div> */}
          <motion.div
            whileHover={{ scale: 1.2 }}
            onClick={() => router.push("/profile")}
            className="cursor-pointer"
          >
            Profile
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </motion.div>
        </div>
      </div>

      <div className="w-full  flex flex-col md:flex-row items-center justify-center px-4 md:px-10 py-10 gap-6">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-[50%] max-w-[700px] h-[550px] p-6 md:p-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col justify-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Let's Get In Touch
          </h1>
          <div className="flex flex-col gap-4 text-base md:text-lg">
            <a
              href="mailto:sushimsushi8699@gmail.com"
              className="flex items-center gap-3 bg-white/20 border border-white/30 px-4 py-3 rounded-lg hover:bg-white/20 transition w-fit"
            >
              <Mail size={20} /> sushimsushi8699@gmail.com
            </a>

            <a
              href="https://wa.me/919970165418"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/20 border border-white/30 px-4 py-3 rounded-lg hover:bg-white/20 transition w-fit"
            >
              <MessageCircle size={20} /> +91 99701 65418
            </a>

            <a
              href="https://instagram.com/__sushim__p.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/20 border border-white/30 px-4 py-3 rounded-lg hover:bg-white/20 transition w-fit"
            >
              <Instagram size={20} /> @__sushim__p.ts
            </a>

            <a
              href="https://www.linkedin.com/in/sushim-padwekar-693960257/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/20 border border-white/30 px-4 py-3 rounded-lg hover:bg-white/20 transition w-fit"
            >
              <Linkedin size={20} /> sushim padwekar
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-[50%] max-w-[700px] h-[550px] p-6 md:p-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl flex flex-col justify-center"
        >
          <form className="flex flex-col gap-5">
            <input
              type="text"
              placeholder="Your Name"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 px-4 py-3 rounded-lg focus:outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 px-4 py-3 rounded-lg focus:outline-none"
            />
            <textarea
              rows={5}
              placeholder="Your Message"
              className="bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 px-4 py-3 rounded-lg focus:outline-none resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={true}
              className="mt-2 bg-blue-600 disabled:bg-blue-800 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Button is Currently Disabled
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactMePage;
