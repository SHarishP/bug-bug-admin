"use client";
import useAuthStore from "@/stores/auth-store";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

interface Token {
  email: string;
  name: string;
  avatar: string;
  iat: number;
  exp: number;
}

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { onAuthSuccess, clearAuth } = useAuthStore();

  const checkLogin = async () => {
    try {
      const access_token = await getCookie("access_token");
      // if no access token, clear auth
      if (!access_token) {
        clearAuth();
        return;
      }

      // decode token if available
      const token: Token = jwtDecode(access_token);

      // check wether token already expired
      if (Date.now() >= token.exp * 1000) {
        toast.error("Session expired please relogin");
        clearAuth();
        return;
      } else {
        onAuthSuccess({
          name: token.name,
          email: token.email,
          avatar: token.avatar,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      checkLogin();
    }
  }, []);
  return <>{children}</>;
}
