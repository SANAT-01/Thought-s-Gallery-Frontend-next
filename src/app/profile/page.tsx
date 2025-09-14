"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    CalendarDateRangeIcon,
    ChartBarSquareIcon,
    Cog8ToothIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
    PencilIcon,
    PencilSquareIcon,
} from "@heroicons/react/24/solid";

export default function ProfilePage() {
    const [user, setUser] = useState<{
        id: string;
        username: string;
        email: string;
        created_at?: string;
    } | null>(null);
    const [thoughts, setThoughts] = useState<
        { name: string; content: string; created_at: string }[]
    >([]);
    const router = useRouter();
    const [likesData, setLikesData] = useState<[]>([]);
    const [dislikesData, setDislikesData] = useState<[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/signin");
            return;
        }

        const id = localStorage.getItem("user_id");
        const storedUsername = localStorage.getItem("username");
        const storedEmail = localStorage.getItem("email");

        if (id && storedUsername && storedEmail) {
            setUser({
                id,
                username: storedUsername,
                email: storedEmail,
                created_at: new Date().toISOString(),
            });
        }

        // fetch user thoughts (replace with your API)
        if (id) {
            fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/thoughts?user_id=${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setThoughts(data.data || []);
                    }
                })
                .catch((err) => console.error("Error fetching thoughts:", err));
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}/likes`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setLikesData(data.data || []);
                    }
                })
                .catch((err) => console.error("Error fetching likes:", err));
            fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${id}/dislikes`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
                .then((res) => res.json())
                .then((data) => {
                    if (data.success) {
                        setDislikesData(data.data || []);
                    }
                })
                .catch((err) => console.error("Error fetching dislikes:", err));
        }
    }, [router]);

    if (!user) {
        return (
            <div className="text-center py-20 text-white">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
                {/* Profile Card */}
                <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md text-center">
                    {localStorage.getItem("profileImageUrl") ? (
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            <Image
                                height={80}
                                width={80}
                                src={
                                    localStorage.getItem("profileImageUrl") ??
                                    ""
                                }
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-20 h-20 mx-auto rounded-full bg-brand-violet flex items-center justify-center text-2xl font-bold text-white">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <h2 className="mt-3 text-lg font-bold text-white">
                        {user.username}
                    </h2>
                    <p className="text-gray-400">{user.email}</p>
                    <p className="mt-2 flex justify-center text-sm text-gray-500 items-center">
                        <CalendarDateRangeIcon className="h-4 w-4 mr-1" />
                        {user.created_at ? (
                            <span>
                                {`Joined ${new Date(
                                    user.created_at
                                ).toLocaleDateString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}`}
                            </span>
                        ) : (
                            <span>{`Unknown`}</span>
                        )}
                    </p>

                    <div className="flex justify-center gap-3 mt-4">
                        <button
                            className="flex gap-2 w-[115px] justify-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-sm"
                            onClick={() => router.push("/settings")}
                        >
                            <PencilIcon className="h-5 w-5" />
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={() => router.push("/settings")}
                            className="flex gap-2 w-[115px] justify-center px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white text-sm"
                        >
                            <Cog8ToothIcon className="h-5 w-5" />
                            <span>Settings</span>
                        </button>
                    </div>
                </div>

                {/* Activity Stats */}
                <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md">
                    <h3 className="text-md items-center font-semibold text-white mb-4">
                        <ChartBarSquareIcon className="h-5 w-5 inline-block mr-1" />
                        <span>Activity Stats</span>
                    </h3>
                    <div className="space-y-3 text-gray-300">
                        <div className="flex justify-between">
                            <span>Thoughts</span>
                            <span className="text-white">
                                {thoughts.length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <div className="inline-flex items-center gap-2">
                                <HandThumbUpIcon className="h-4 w-4" />
                                <span>Likes Received</span>
                            </div>
                            <span className="text-brand-violet">
                                {likesData.length}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <div className="inline-flex items-center gap-2">
                                <HandThumbDownIcon className="h-4 w-4" />
                                <span>Dislikes Received</span>
                            </div>
                            <span className="text-gray-400">
                                {dislikesData.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="md:col-span-2">
                <h2 className="text-xl flex items-center gap-2 font-bold text-white mb-4">
                    <PencilSquareIcon className="h-5 w-5" />
                    <span> My Thoughts</span>
                </h2>

                {thoughts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 rounded-xl bg-black/40 border border-white/10">
                        <div className="text-5xl mb-4 text-gray-600">💭</div>
                        <h3 className="text-lg font-semibold text-white">
                            No thoughts yet
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            You haven&#39;t shared any thoughts yet. Start
                            sharing your ideas with the community!
                        </p>
                        <button
                            onClick={() => router.push("/")}
                            className="px-6 py-2 rounded-md bg-brand-violet hover:bg-brand-violet-dark text-white font-medium transition"
                        >
                            ➕ Share your first thought
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {thoughts.map((thought, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-lg bg-black/50 border border-white/10 text-white shadow-md"
                            >
                                {thought.content}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
