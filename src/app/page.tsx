"use client";

import { Signout } from "@/util/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Thought = {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  user_id: string;
  created_at: string;
};

export default function HomePage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [newThought, setNewThought] = useState("");
  const [posting, setPosting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin"); // redirect if not logged in
      return;
    }
  }, [router]);

  // Fetch all thoughts
  useEffect(() => {
    const fetchThoughts = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thoughts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setThoughts(data.data);
        } else {
          console.log("first");
          Signout();
          router.push("/signin");
        }
      } catch (err) {
        console.error("Failed to load thoughts", err);
        Signout();
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };
    fetchThoughts();
  }, []);

  // Like / Dislike
  const handleReaction = async (id: string, type: "like" | "dislike") => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thoughts/${id}/${type}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setThoughts((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  likes: type === "like" ? t.likes + 1 : t.likes,
                  dislikes: type === "dislike" ? t.dislikes + 1 : t.dislikes,
                }
              : t
          )
        );
      }
    } catch (err) {
      console.error("Error reacting:", err);
    }
  };

  // Post a new thought
  const handlePost = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!newThought.trim()) return;

  setPosting(true);
  const token = localStorage.getItem("authToken");
  const user_id = localStorage.getItem("user_id"); // ✅ get user id

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id,          // ✅ required by API
        content: newThought,
      }),
    });

    const data = await res.json();
    if (data.success) {
      setThoughts([data.data, ...thoughts]); // prepend
      setNewThought("");
    }
  } catch (err) {
    console.error("Error posting thought:", err);
  } finally {
    setPosting(false);
  }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-gray-400">
        Loading thoughts...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <h1 className="text-3xl font-bold text-center text-brand-violet mb-8">
        🌌 Thought’s Gallery 💭
      </h1>

      {/* Post Thought Form */}
      <form
        onSubmit={handlePost}
        className="glass max-w-xl mx-auto mb-8 p-4 rounded-xl shadow-lg border border-brand-violet/30"
      >
        <textarea
          placeholder="✨ Share your thought..."
          value={newThought}
          onChange={(e) => setNewThought(e.target.value)}
          className="w-full bg-transparent border border-white/10 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-violet"
          rows={3}
        />
        <button
          type="submit"
          disabled={posting}
          className="mt-3 w-full bg-brand-violet hover:bg-brand-violet-dark text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {posting ? "Posting..." : "Post Thought"}
        </button>
      </form>

      {/* Thoughts Feed */}
      <div className="max-w-2xl mx-auto space-y-6">
        {thoughts.map((thought) => (
          <div
            key={thought.id}
            className="glass p-6 rounded-xl shadow-md border border-white/10 hover:border-brand-violet/40 transition"
          >
            <p className="text-lg font-medium">{thought.content}</p>
            <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
              <span>by User {thought.user_id.slice(0, 6)}...</span>
              <span>
                {new Date(thought.created_at).toLocaleDateString()} •{" "}
                {new Date(thought.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleReaction(thought.id, "like")}
                className="px-3 py-1 bg-gradient-to-r from-brand-violet to-brand-violet-dark text-white rounded-md text-sm hover:scale-105 transition"
              >
                👍 {thought.likes}
              </button>
              <button
                onClick={() => handleReaction(thought.id, "dislike")}
                className="px-3 py-1 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-md text-sm hover:scale-105 transition"
              >
                👎 {thought.dislikes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
