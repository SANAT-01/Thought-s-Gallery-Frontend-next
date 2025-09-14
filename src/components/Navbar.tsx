"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Signout } from "@/lib/helper";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import {
    ArrowLeftStartOnRectangleIcon,
    Bars3Icon,
    ChatBubbleLeftRightIcon,
    Cog8ToothIcon,
    UserCircleIcon,
} from "@heroicons/react/24/solid";
// import { RootState } from "@/store/store";

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    // const auth = useSelector((state: RootState) => state.auth);
    // const theme = useSelector((state: RootState) => state.theme);

    // console.log("Auth State:", auth);
    // console.log("Theme State:", theme);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsLoggedIn(!!token);

        const protectedRoutes = ["/profile", "/dashboard", "/settings"];
        if (!token && protectedRoutes.includes(pathname)) {
            router.push("/signin");
        }
    }, [router, pathname]);

    const handleLogout = () => {
        Signout();
        setIsLoggedIn(false);
        dispatch(logout());
        router.push("/signin");
    };

    return (
        <header className="bg-[#0b0b0b]/80 backdrop-blur-md border-b border-white/10">
            <div className="mx-auto max-w-6xl h-14 px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 select-none">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-violet text-white font-bold shadow-md">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    </span>
                    <span className="text-lg font-semibold text-white tracking-tight">
                        Thought’s Gallery
                    </span>
                </Link>

                {/* Right Side */}
                <nav className="flex items-center gap-3">
                    {isLoggedIn && (
                        <div className="flex items-center gap-3">
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
                                    <Bars3Icon className="h-5 w-5" />
                                </button>

                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[#111]/95 backdrop-blur-md border border-white/10 shadow-lg z-50">
                                        <Link
                                            href="/profile"
                                            className="px-4 gap-2 py-2 flex text-sm text-white hover:bg-brand-violet/30 rounded-t-xl"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <UserCircleIcon className="h-5 w-5" />
                                            <span>Profile</span>
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex gap-2 px-4 py-2 text-sm text-white hover:bg-brand-violet/30"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <Cog8ToothIcon className="h-5 w-5" />
                                            <span>Settings</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="flex gap-2 w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-600/20 rounded-b-xl"
                                        >
                                            <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Navbar;
