"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
}

interface Thought {
    id: string;
    content: string;
    created_at: string;
    likes: number;
    dislikes: number;
}

export default function ProfilePage() {
    const { id } = useParams(); // profile/[id]
    const [user, setUser] = useState<User | null>(null);
    const [thoughts, setThoughts] = useState<Thought[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchUser = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "authToken"
                            )}`,
                        },
                    }
                );
                const data = await res.json();
                if (data.success) setUser(data.data);
            } catch (err) {
                console.error("Failed to load user:", err);
            }
        };

        const fetchThoughts = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thoughts?user_id=${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "authToken"
                            )}`,
                        },
                    }
                );
                const data = await res.json();
                if (data.success) setThoughts(data.data);
            } catch (err) {
                console.error("Failed to load thoughts:", err);
            }
        };

        Promise.all([fetchUser(), fetchThoughts()]).finally(() =>
            setLoading(false)
        );
    }, [id]);

    if (loading)
        return <div className="text-center py-10 text-white">Loading...</div>;

    if (!user)
        return (
            <div className="text-center py-10 text-red-500">User not found</div>
        );

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            {/* User Info */}
            <div className="glass p-6 rounded-2xl shadow-lg mb-8 text-center">
                <h1 className="text-2xl font-bold text-brand-violet">
                    {user.username}
                </h1>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
            </div>

            {/* User's Thoughts */}
            <div className="glass p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-semibold text-brand-violet mb-4">
                    Thoughts by {user.username}
                </h2>
                {thoughts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No thoughts yet.</p>
                ) : (
                    <div className="space-y-4">
                        {thoughts.map((t) => (
                            <div
                                key={t.id}
                                className="glass p-4 rounded-lg hover:border-brand-violet/50 transition"
                            >
                                <p className="text-white">{t.content}</p>
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>
                                        {new Date(
                                            t.created_at
                                        ).toLocaleDateString()}{" "}
                                        {new Date(
                                            t.created_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span>
                                        👍 {t.likes} | 👎 {t.dislikes}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
