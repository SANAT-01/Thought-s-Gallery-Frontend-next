"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface User {
    id: string;
    username: string;
    email: string;
    created_at: string;
    profile_picture?: string;
    bio?: string;
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
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* User Info */}
            <div className="glass p-8 rounded-2xl shadow-2xl border border-white/10 mb-10 text-center relative overflow-hidden">
                {/* subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-violet/20 to-transparent rounded-2xl pointer-events-none"></div>

                {user.profile_picture ? (
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-brand-violet/40 shadow-lg">
                        <Image
                            height={96}
                            width={96}
                            src={user.profile_picture}
                            alt="Profile Picture"
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-24 h-24 mx-auto rounded-full bg-brand-violet flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                )}

                <h1 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
                    {user.username}
                </h1>
                <div className="text-gray-300 pb-10 pt-2">{user.bio}</div>
                <p className="text-gray-300">{user.email}</p>
                <p className="text-sm text-gray-400 mt-1">
                    Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
            </div>

            {/* User's Thoughts */}
            <div className="glass p-8 rounded-2xl shadow-xl border border-white/10">
                <h2 className="text-xl font-semibold text-brand-violet mb-6">
                    ✨ Thoughts by {user.username}
                </h2>

                {thoughts.length === 0 ? (
                    <p className="text-gray-400 text-center">
                        No thoughts yet.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {thoughts.map((t) => (
                            <div
                                key={t.id}
                                className="glass p-5 rounded-xl border border-white/10 hover:border-brand-violet/40 hover:shadow-lg transition-all duration-300 group"
                            >
                                <p className="text-white group-hover:text-brand-violet transition">
                                    {t.content}
                                </p>
                                <div className="flex justify-between items-center text-xs text-gray-400 mt-3">
                                    <span>
                                        {new Date(
                                            t.created_at
                                        ).toLocaleDateString()}{" "}
                                        •{" "}
                                        {new Date(
                                            t.created_at
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    {/* <div className="flex gap-3 text-gray-500 group-hover:text-gray-300">
                                        <span>👍 {t.likes}</span>
                                        <span>👎 {t.dislikes}</span>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
