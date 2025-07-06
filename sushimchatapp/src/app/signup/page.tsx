"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { EyeClosed, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const { signup, isSigningUp } = useAuthStore();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log(formData);
    if (signup) {
      signup(formData);
    }
  };

  return (
    <div className="h-screen w-screen bg-radial from-[#0E0E0F] to-[#243C52] opacity-100 flex items-center justify-center">
      <div className="w-[410px] h-[624px] items-center px-[40px] py-[80px] opacity-100 rounded-[28.46px] bg-[#808080]/[0.28] stroke-2   justify-center flex flex-col">
        <h1>SUSHIM</h1>
        <div className="w-[250px] h-[405.66px] align-top gap-6 flex flex-col items-start justify-center">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-2   opacity-100">
              <label className="text-sm">
                Email
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  value={formData.email}
                  type="email"
                  className="w-full px-4 py-2 rounded-[5px] bg-white placeholder:text-gray-500 text-black"
                  placeholder="xyzAbc@gmail.com"
                />
              </label>
              <label className="text-sm">
                Full Name
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                  }}
                  value={formData.fullName}
                  type="text"
                  className="w-full px-4 py-2 rounded-[5px] bg-white placeholder:text-gray-500 text-black"
                  placeholder="Sushim Padwekar"
                />
              </label>
              <label className="text-sm ">
                Password
                <div className="w-full flex  items-center bg-white rounded-[5px]">
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    value={formData.password}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 rounded-[5px] bg-white placeholder:text-gray-500 text-black"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeClosed color="black" />
                    ) : (
                      <EyeOff color="black" />
                    )}
                  </button>
                </div>
              </label>
              <div className="flex items-start">
                <button className="underline text-md ">
                  Forgot Password ?
                </button>
              </div>
            </div>
            <Link href="/login">
              <div
                className="w-full h-10 flex gap-[10px] items-center justify-center rounded-[7.11px] text-white"
                style={{
                  backgroundColor: isSigningUp ? "lightblue" : "#005FB9",
                }}
              >
                {isSigningUp ? <Loader2 /> : "Sign Up"}
              </div>
            </Link>
          </form>

          <p className="w-full h-4 text-center">or continue with</p>
          <div className="flex gap-[10px] text-center">
            <div className=" rounded-[7.11px] text-black bg-white w-[72px] h-[35.08px] text-center">
              google
            </div>
            <div className=" rounded-[7.11px] text-black bg-white w-[72px] h-[35.08px] text-center">
              google
            </div>
            <div className=" rounded-[7.11px] text-black bg-white w-[72px] h-[35.08px] text-center">
              google
            </div>
          </div>
          <p className="w-full text-xs ">
            Don't have an account yet?
            <span className="underline">
              <Link href="/login"> Login </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
