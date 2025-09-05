"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    router.push("/signin");
  };

  return (
    <div className="bg-[#0b0b0b]/95 border-b border-brand-violet/30 shadow-lg">
      <div className="mx-auto max-w-6xl h-14 px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-violet text-white font-bold">
            💬
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Thought’s Gallery
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-md bg-brand-violet text-white font-medium hover:bg-brand-violet-dark transition"
          >
            Home
          </Link>

          {!isLoggedIn ? (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-md bg-[#171717] text-foreground border border-white/10 hover:bg-black transition"
              >
                Sign Up
              </Link>
              <Link
                href="/signin"
                className="px-4 py-2 rounded-md bg-[#171717] text-foreground border border-white/10 hover:bg-black transition"
              >
                Sign In
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              Logout
            </button>
          )}
        </nav>
            <Link
    href="/profile"
    className="px-4 py-2 rounded-md bg-[#171717] text-foreground border border-white/10 hover:bg-black transition"
    >
    Profile
    </Link>
      </div>
    </div>
  );
}
