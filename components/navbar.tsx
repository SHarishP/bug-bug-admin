"use client";

import useAuthStore from "@/stores/auth-store";
import MainNav from "./main-nav";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = () => {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();
  return (
    <div className="border-b w-[92%] mx-auto">
      <div className="flex h-16 items-center justify-between">
        <div className="basis-1/3">
          <Link href="/">Bug-Bug Admin</Link>
        </div>

        {/* Main Navigation */}
        <div className=" hidden md:flex justify-center">
          <MainNav />
        </div>

        {/* Profile */}
        <div className="flex basis-1/3 justify-end items-center gap-2">
          <p>Welcome, {user?.name}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            type="submit"
            onClick={() => {
              clearAuth();
              router.push("/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
