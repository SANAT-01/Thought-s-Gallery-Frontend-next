"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("authToken", data.data.authToken);
        localStorage.setItem("user_id", data.data.user.id);
        localStorage.setItem("username", data.data.user.username);
        localStorage.setItem("email", data.data.user.email);

        setMessage("✅ User created successfully!");
        router.push("/");
      } else {
        setMessage("❌ " + (data.message || "Signup failed"));
      }
    } catch (err) {
      setMessage("⚠️ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center bg-background px-4 h-screen">
      <div className="glass w-full max-w-md rounded-xl p-6 sm:p-8 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-violet text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-violet text-white placeholder-gray-500 text-sm sm:text-base"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-violet text-white placeholder-gray-500 text-sm sm:text-base"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 sm:py-3 bg-black/40 border border-white/10 rounded-lg focus:ring-2 focus:ring-brand-violet text-white placeholder-gray-500 text-sm sm:text-base"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="glass w-full bg-brand-violet hover:bg-brand-violet-dark text-white py-2 sm:py-3 rounded-lg transition disabled:opacity-50 text-sm sm:text-base font-medium"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-300">{message}</p>
        )}

        <p className="text-center text-gray-400 mt-6 text-xs sm:text-sm">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-brand-violet hover:text-brand-violet-dark"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </main>
  );
}
