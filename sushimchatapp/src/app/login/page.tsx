"use client";
import React, { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { EyeClosed, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
const LogInPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isloggingIn } = useAuthStore();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (login) {
      const success = await login(formData);
      if (success) router.push("/Homepage");
    }
  };

  return (
    <div className="h-screen w-screen bg-radial from-[#0E0E0F] to-[#243C52] opacity-100 flex items-center justify-center">
      <div className="w-[410px] h-[555.66px] items-center px-[40px] py-[80px] opacity-100 rounded-[28.46px] bg-[#808080]/[0.28] stroke-2   justify-center flex flex-col">
        <h1>SUSHIM</h1>
        <div className="w-[250px] h-[405.66px] align-top gap-6 flex flex-col items-start justify-center">
          <h1>LOGIN</h1>
          <form onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-2 h-[154.58px]  opacity-100">
              <label className="text-sm">
                Email
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  value={formData.email}
                  type="email"
                  className="w-full h-8 px-4 gap-[10px] rounded-[5px] bg-white py-4 placeholder:text-gray-500 text-black"
                  placeholder="xyzAbc@gmail.com"
                />
              </label>
              <label className="text-sm">
                Password
                <div className="w-full flex items-center bg-white rounded-[5px]">
                  <input
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    value={formData.password}
                    type={showPassword ? "text" : "password"}
                    className="w-full h-8  p-4 gap-[10px] rounded-[5px] bg-white py-4 placeholder:text-gray-500 text-black"
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
            <button
              type="submit"
              className="w-full h-10 flex gap-[10px] items-center justify-center bg-[#005FB9] rounded-[7.11px]"
            >
              {isloggingIn ? "...signing In" : "Sign In"}
            </button>
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
              <Link href="/signup"> Register for free </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
