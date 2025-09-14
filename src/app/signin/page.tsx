"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { showToast } from "@/store/slices/toastSlice";

export default function SigninPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const router = useRouter();

    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/signin`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await res.json();
            if (data.success) {
                localStorage.setItem("authToken", data.data.authToken);
                localStorage.setItem("user_id", data.data.user.id);
                localStorage.setItem("username", data.data.user.username);
                localStorage.setItem("email", data.data.user.email);
                if (data.data.user.profile_picture) {
                    localStorage.setItem(
                        "profileImageUrl",
                        data.data.user.profile_picture
                    );
                }
                dispatch(
                    login({ token: data.data.authToken, user: data.data.user })
                );
                dispatch(
                    showToast({
                        type: "success",
                        message: "Signed in successfully!",
                    })
                );
                router.push("/"); // redirect to home
            } else {
                setMessage("❌ " + (data.message || "Signin failed"));
                dispatch(
                    showToast({
                        type: "error",
                        message: "Signin failed. Please try again.",
                    })
                );
            }
        } catch (err) {
            setMessage("⚠️ Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex items-center justify-center bg-background px-4 h-screen">
            {/* 🔹 Glass Card */}
            <div className="glass w-full max-w-md rounded-xl p-6 sm:p-8 shadow-xl border border-white/10">
                <h1 className="text-2xl sm:text-3xl font-bold text-brand-violet text-center mb-6">
                    Sign In
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-violet text-white placeholder-gray-500 text-sm sm:text-base"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-violet text-white placeholder-gray-500 text-sm sm:text-base"
                        required
                    />

                    {/* 🔹 Glass Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-violet hover:bg-brand-violet-dark text-white py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-sm text-gray-300">
                        {message}
                    </p>
                )}

                <p className="text-center text-gray-400 mt-6 text-sm">
                    Don’t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-brand-violet hover:text-brand-violet-dark"
                    >
                        Sign up here
                    </Link>
                </p>
            </div>
        </main>
    );
}
