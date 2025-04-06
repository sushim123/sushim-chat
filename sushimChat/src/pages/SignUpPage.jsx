import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full Name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Email Format is Invalid");
    if (!formData.password.trim()) return toast.error("Password is required");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success===true) signup(formData)
  };

  return (
    <>
      <div>
        <div>
          <form className="h-screen w-screen flex" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4 justify-center h-[80%] w-[50%] items-center">
              <div className="flex flex-col w-full max-w-xs">
                <label className="text-sm font-medium mb-1">Full Name</label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                  }}
                  value={formData.fullName}
                  type="text"
                  className="input placeholder:pl-3 p-2 border-2  rounded-md outline-none"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="flex flex-col w-full max-w-xs">
                <label className="text-sm font-medium mb-1">Email</label>
                <div className="relative flex items-center border rounded-md p-2">
                  <svg
                    className="h-4 w-4 opacity-50 absolute left-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  <input
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                    }}
                    type="email"
                    placeholder="mail@site.com"
                    required
                    className="pl-8 w-full outline-none"
                  />
                </div>
                <p className="text-red-500 text-xs hidden">
                  Enter a valid email address
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col w-full max-w-xs">
                <label className="text-sm font-medium mb-1">Password</label>
                <div className="relative flex items-center border rounded-md p-2">
                  <svg
                    className="h-4 w-4 opacity-50 absolute left-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <g
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeWidth="2.5"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle
                        cx="16.5"
                        cy="7.5"
                        r=".5"
                        fill="currentColor"
                      ></circle>
                    </g>
                  </svg>
                  <input
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                    }}
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    minLength={8}
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    title="Must be more than 8 characters, including a number, lowercase letter, and uppercase letter"
                    className="pl-8 w-full outline-none"
                  />
                  <button
                    type="button"
                    className="absolue inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>
              <button
                className="btn btn-dash btn-success"
                disabled={isSigningUp}
              >
                {isSigningUp ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
              <div className="text-center">
                <p>
                  Already Have an acount?
                  <Link to="/login" className="link link-primary">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
