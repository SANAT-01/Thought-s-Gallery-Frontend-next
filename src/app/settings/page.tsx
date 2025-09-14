"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    BellAlertIcon,
    InboxArrowDownIcon,
    LockClosedIcon,
    ShieldExclamationIcon,
    UserCircleIcon,
} from "@heroicons/react/24/solid";

export default function SettingsPage() {
    const [user, setUser] = useState<{
        id: string;
        username: string;
        email: string;
        image: string;
        bio: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [profileImage, setProfileImage] = useState<File | null>(null); // new state

    // toggles
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(false);
    const [likeNotifications, setLikeNotifications] = useState(true);
    const [commentNotifications, setCommentNotifications] = useState(true);

    const [publicProfile, setPublicProfile] = useState(true);
    const [showEmail, setShowEmail] = useState(false);
    const [allowComments, setAllowComments] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/signin");
            return;
        }

        const fetchSettings = async () => {
            try {
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_API_BASE_URL
                    }/user/${localStorage.getItem("user_id")}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const data = await res.json();
                if (data.success) {
                    setUser({
                        id: data.data.id,
                        username: data.data.username,
                        email: data.data.email,
                        image: data.data.profile_picture,
                        bio: data.data.bio || "",
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };

        fetchSettings();
    }, [router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUser((prev) =>
                prev ? { ...prev, image: URL.createObjectURL(file) } : prev
            );
            setProfileImage(file);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("username", user.username);
            formData.append("bio", user.bio);
            if (profileImage) {
                formData.append("profile_picture", profileImage); // must match backend
            }

            // 🚀 Debug: log FormData keys
            // for (const [key, value] of formData.entries()) {
            //     console.log(key, value);
            // }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${user.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                        // ❌ do NOT set Content-Type here
                    },
                    body: formData,
                }
            );

            const data = await res.json();
            if (data.success) {
                setUser({
                    id: data.data.id,
                    username: data.data.username,
                    email: data.data.email,
                    image: data.data.profile_picture,
                    bio: data.data.bio || "",
                });

                localStorage.setItem("username", data.data.username);
                localStorage.setItem("email", data.data.email);
                // if (data.data.profile_picture) {
                //     localStorage.setItem(
                //         "profileImage",
                //         data.data.profile_picture
                //     );
                // }

                alert("✅ Profile updated successfully");
            } else {
                alert("❌ Failed to update profile");
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("❌ Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    // Delete account
    const handleDelete = async () => {
        if (!user) return;
        if (
            !confirm(
                "⚠️ Are you sure you want to delete your account? This cannot be undone."
            )
        )
            return;

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${user.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );

            const data = await res.json();
            if (data.success) {
                localStorage.clear();
                alert("✅ Account deleted successfully");
                router.push("/signup");
            } else {
                alert("❌ Failed to delete account");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("❌ Error deleting account");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="text-center py-20 text-white">
                Loading settings...
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 space-y-6">
            {/* Profile Settings */}
            <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
                    <UserCircleIcon className="h-7 w-7" />
                    <span>Profile Settings</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                    Update your profile information and preferences.
                </p>

                {/* Profile Image Upload */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10">
                        {user.image ? (
                            <Image
                                height={80}
                                width={80}
                                src={user.image}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                No Image
                            </div>
                        )}
                    </div>
                    <label className="px-3 py-2 rounded-md bg-brand-violet hover:bg-brand-violet-dark text-white text-sm cursor-pointer">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        defaultValue={user.username}
                        onChange={(e) =>
                            setUser({ ...user, username: e.target.value })
                        }
                        className="px-4 py-2 rounded-md bg-black/60 border border-white/10 text-white focus:ring-2 focus:ring-brand-violet"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        defaultValue={user.email}
                        disabled
                        className="px-4 py-2 rounded-md bg-black/60 border border-white/10 text-white focus:ring-2 focus:ring-brand-violet"
                    />
                </div>

                <input
                    type="text"
                    defaultValue={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    placeholder="Tell us about yourself"
                    className="w-full px-4 py-2 rounded-md bg-black/60 border border-white/10 text-white focus:ring-2 focus:ring-brand-violet mb-4"
                />

                <button
                    className="w-full px-4 flex justify-center gap-2 items-center py-2 rounded-md bg-brand-violet hover:bg-brand-violet-dark text-white font-medium"
                    onClick={handleUpdate}
                    disabled={loading}
                >
                    <InboxArrowDownIcon className="h-5 w-5" />
                    <span>Save Profile</span>
                </button>
            </div>

            {/* Notification Settings */}
            <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md">
                <h2 className="text-lg flex gap-2 items-center font-semibold text-white mb-2">
                    <BellAlertIcon className="h-5 w-5" />
                    <span> Notification Settings</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                    Manage how you receive notifications.
                </p>

                {[
                    {
                        label: "Email Notifications",
                        desc: "Receive notifications via email",
                        state: emailNotifications,
                        setState: setEmailNotifications,
                    },
                    {
                        label: "Push Notifications",
                        desc: "Receive push notifications in your browser",
                        state: pushNotifications,
                        setState: setPushNotifications,
                    },
                    {
                        label: "Like Notifications",
                        desc: "Get notified when someone likes your thoughts",
                        state: likeNotifications,
                        setState: setLikeNotifications,
                    },
                    {
                        label: "Comment Notifications",
                        desc: "Get notified when someone comments on your thoughts",
                        state: commentNotifications,
                        setState: setCommentNotifications,
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                        <div>
                            <p className="text-white font-medium">
                                {item.label}
                            </p>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={item.state}
                                onChange={() => item.setState(!item.state)}
                                className="hidden"
                            />
                            <span
                                className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ${
                                    item.state
                                        ? "bg-brand-violet"
                                        : "bg-gray-600"
                                }`}
                            >
                                <span
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                                        item.state ? "translate-x-5" : ""
                                    }`}
                                ></span>
                            </span>
                        </label>
                    </div>
                ))}
            </div>

            {/* Privacy Settings */}
            <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md">
                <h2 className="flex gap-2 items-center text-lg font-semibold text-white mb-2">
                    <LockClosedIcon className="h-5 w-5" />
                    <span>Privacy Settings</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                    Control your privacy and visibility preferences.
                </p>

                {[
                    {
                        label: "Public Profile",
                        desc: "Make your profile visible to everyone",
                        state: publicProfile,
                        setState: setPublicProfile,
                    },
                    {
                        label: "Show Email",
                        desc: "Display your email on your profile",
                        state: showEmail,
                        setState: setShowEmail,
                    },
                    {
                        label: "Allow Comments",
                        desc: "Let others comment on your thoughts",
                        state: allowComments,
                        setState: setAllowComments,
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                    >
                        <div>
                            <p className="text-white font-medium">
                                {item.label}
                            </p>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={item.state}
                                onChange={() => item.setState(!item.state)}
                                className="hidden"
                            />
                            <span
                                className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ${
                                    item.state
                                        ? "bg-brand-violet"
                                        : "bg-gray-600"
                                }`}
                            >
                                <span
                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                                        item.state ? "translate-x-5" : ""
                                    }`}
                                ></span>
                            </span>
                        </label>
                    </div>
                ))}
            </div>

            {/* Danger Zone */}
            <div className="p-6 rounded-xl bg-black/50 border border-red-500/30 shadow-md">
                <h2 className="flex gap-2 items-center text-lg font-semibold text-red-400 mb-2">
                    <ShieldExclamationIcon className="h-5 w-5" />
                    <span>Danger Zone</span>
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                    Irreversible and destructive actions.
                </p>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-full px-4 py-2 rounded-md bg-red-400 hover:bg-red-600 text-white font-medium transition disabled:opacity-50"
                >
                    {loading ? "Deleting..." : "Delete Account"}
                </button>
            </div>
        </div>
    );
}
