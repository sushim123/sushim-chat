
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Toaster } from "react-hot-toast";

export const ClientWrapper = ({ children }: { children: React.ReactNode }) => {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth?.();
  }, [checkAuth]);

  return (
    <>
      <Toaster />
      {children}
    </>
  );
};
