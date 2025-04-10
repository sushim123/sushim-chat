import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import  backgroundImage  from "../assets/image.png";
const LogInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isloggingIn } = useAuthStore();
  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage })`}}
    >
      <div className=" w-[80%] h-[80%] flex items-center justify-center">
        <div className="h-[557.66px] w-[410px] bg-gradient-to-b from-cyan-500 to-cyan-100 text-black opacity-60 stroke-cyan-500 rounded-[29px] items-center flex justify-center ">
          <div className="h-[407px] w-[250px] items-center">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
              <div className="w-[250px] h-[154px] flex flex-col items-center justify-center">
                <label>Email</label>
                <input
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  type="email"
                  className="p-3 bg-white text-black placeholder:text-gray-900"
                  placeholder="Enter Your Email"
                ></input>
                <label>Password</label>
                <input
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  type="password"
                  className="p-3 bg-white text-black placeholder:text-gray-900"
                  placeholder="Enter Your Password"
                ></input>
                <button className="btn" disabled={isloggingIn}>
                  {isloggingIn ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
