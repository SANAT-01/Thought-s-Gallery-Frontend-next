"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);

    const protectedRoutes = ["/profile", "/dashboard", "/settings"];
    if (!token && protectedRoutes.includes(pathname)) {
      router.push("/signin");
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    router.push("/signin");
  };

  return (
    <header className="bg-[#0b0b0b]/80 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-6xl h-14 px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 select-none">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-violet text-white font-bold shadow-md">
            💬
          </span>
          <span className="text-lg font-semibold text-white tracking-tight">
            Thought’s Gallery
          </span>
        </Link>

        {/* Right Side */}
        <nav className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Home Button */}
              <Link
                href="/"
                className="hidden md:inline px-4 py-2 rounded-lg bg-brand-violet text-white font-medium hover:bg-brand-violet-dark transition shadow-md"
              >
                Home
              </Link>

              {/* More Options Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-violet text-white hover:bg-brand-violet-dark transition shadow-md"
                >
                  ☰
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111]/95 backdrop-blur-md border border-white/10 shadow-lg z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-white hover:bg-brand-violet/30 rounded-t-xl"
                      onClick={() => setMenuOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-white hover:bg-brand-violet/30"
                      onClick={() => setMenuOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-600/20 rounded-b-xl"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-[#171717] text-white border border-white/10 hover:bg-black transition"
              >
                Sign Up
              </Link>
              <Link
                href="/signin"
                className="px-4 py-2 rounded-lg bg-[#171717] text-white border border-white/10 hover:bg-black transition"
              >
                Sign In
              </Link> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
