"use client";
import React, { useEffect, useState } from "react";
import profileImage from "../../../public/profile.png";
import { useAuthStore } from "../../store/useAuthStore";
import { Camera, Mail, Pencil, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Navigate } from "react-router-dom";

const ProfilePage = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const authUser = useAuthStore((state) => state.authUser);
  useEffect(() => {
    checkAuth?.();
  }, []);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const updateFullName = useAuthStore((state) => state.updateFullName);
  const logout = useAuthStore((state) => state.logout);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);
  const [selectedImage, setSelectedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(authUser?.fullName || "");
  const router = useRouter();

  const handleSave = async () => {
    setIsEditing(false);
    if (updateFullName) {
      await updateFullName(name);
    }
  };
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      // await updateProfile({ profilePic: base64Image });
    };
  };
  const handleLogout = () => {
    logout;
    router.push("/login");
  };

  if (isCheckingAuth)
    return <div className="text-white p-10">Loading profile...</div>;
  if (!authUser) {
    router.push("/login");

    return <div className="text-white p-10">User not logged in.</div>;
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <button
          onClick={() => {
            router.back();
          }}
          className="bg-transparent text-center w-48 rounded-2xl h-14 relative text-white text-xl font-semibold group"
          type="button"
        >
          <div className="bg-green-400 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              height="25px"
              width="25px"
            >
              <path
                d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"
                fill="#000000"
              ></path>
              <path
                d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"
                fill="#000000"
              ></path>
            </svg>
          </div>
          <p className="translate-x-2">Go Back</p>
        </button>
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  typeof selectedImage === "string"
                    ? selectedImage
                    : authUser?.profilePic ||
                      (typeof profileImage === "string"
                        ? profileImage
                        : profileImage.src)
                }
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200 hover:text-accent" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <div className="px-4 py-2.5 bg-base-200 rounded-lg flex items-center justify-between border">
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSave();
                    }}
                    autoFocus
                    className="bg-transparent outline-none w-full"
                  />
                ) : (
                  <>
                    <span>{name}</span>
                    <Pencil
                      className="w-5 h-5 text-zinc-500 cursor-pointer hover:text-accent"
                      onClick={() => setIsEditing(true)}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium  mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>
                  {authUser?.createdAt
                    ? new Date(authUser.createdAt).toISOString().split("T")[0]
                    : ""}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
              <div className="text-red-500 text-xl text-center">
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
