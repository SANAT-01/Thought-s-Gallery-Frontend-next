"use client";

import Thought from "@/components/Thought";
import { Signout } from "@/util/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface user {
    id: string;
    username: string;
    profile_picture: string;
}

interface comment {
    id: string;
    content: string;
    profile_picture: string;
    user: user;
}

export interface Thought {
    id: string;
    content: string;
    user_id: string;
    created_at: string; // ISO timestamp
    username: string;
    profile_picture: string;
    liked_by_users: user[];
    disliked_by_users: user[];
    comments: comment[];
}

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
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thoughts`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
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
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought/${id}/${type}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                    body: JSON.stringify({
                        userId: localStorage.getItem("user_id"),
                    }),
                }
            );
            const data = await res.json();
            if (data.success) {
                console.log(data);

                // setThoughts((prev) =>
                //     prev.map((t) =>
                //         t.id === id
                //             ? {
                //                   ...t,
                //                   liked_by_users:
                //                       type === "like"
                //                           ? data.data
                //                           : t.liked_by_users,
                //                   disliked_by_users:
                //                       type === "dislike"
                //                           ? data.data
                //                           : t.disliked_by_users,
                //               }
                //             : t
                //     )
                // );
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
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id, // ✅ required by API
                        content: newThought,
                    }),
                }
            );

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
                    <div key={thought.id}>
                        <Thought
                            thought={thought}
                            handleReaction={handleReaction}
                        />
                    </div>
                ))}
            </div>
        </main>
    );
}
