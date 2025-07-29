"use client";

// import Navbar from "@/components/NavBar";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Homepage from "@/app/Homepage/page";
import SignUpPage from "@/app/signup/page";
import LogInPage from "@/app/login/page";
import SettingsPage from "@/app/settings/page";
import ProfilePage from "@/app/profile/page";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();

  useEffect(() => {
    if (checkAuth) {
      checkAuth();
    }
  }, [checkAuth]);

  console.log(onlineUsers);
  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-4 h-4 bg-blue-500 rounded-full"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <BrowserRouter>
        

        <Routes>
          <Route
            path="/"
            element={authUser ? <Homepage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LogInPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;
