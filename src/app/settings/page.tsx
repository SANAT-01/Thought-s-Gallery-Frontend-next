"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    const id = localStorage.getItem("user_id");
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");

    if (id && storedUsername && storedEmail) {
      setUser({ id, username: storedUsername, email: storedEmail });
    }
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ username: user.username }),
      });

      const data = await res.json();
      if (data.success) {
        setUser({ id: data.data.id, username: data.data.username, email: data.data.email });

        localStorage.setItem("username", data.data.username);
        localStorage.setItem("email", data.data.email);

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
    if (!confirm("⚠️ Are you sure you want to delete your account? This cannot be undone.")) return;

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/${user.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

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
    return <div className="text-center py-20 text-white">Loading settings...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {/* Profile Settings */}
      <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-2">👤 Profile Settings</h2>
        <p className="text-sm text-gray-400 mb-4">Update your profile information and preferences.</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Username"
            defaultValue={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
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

        <textarea
          placeholder="Tell us about yourself"
          className="w-full px-4 py-2 rounded-md bg-black/60 border border-white/10 text-white focus:ring-2 focus:ring-brand-violet mb-4"
        />

        <button className="w-full px-4 py-2 rounded-md bg-brand-violet hover:bg-brand-violet-dark text-white font-medium" onClick={handleUpdate} disabled={loading}>
          💾 Save Profile
        </button>
      </div>

      {/* Notification Settings */}
      <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-2">🔔 Notification Settings</h2>
        <p className="text-sm text-gray-400 mb-4">Manage how you receive notifications.</p>

        {[
          { label: "Email Notifications", desc: "Receive notifications via email", state: emailNotifications, setState: setEmailNotifications },
          { label: "Push Notifications", desc: "Receive push notifications in your browser", state: pushNotifications, setState: setPushNotifications },
          { label: "Like Notifications", desc: "Get notified when someone likes your thoughts", state: likeNotifications, setState: setLikeNotifications },
          { label: "Comment Notifications", desc: "Get notified when someone comments on your thoughts", state: commentNotifications, setState: setCommentNotifications },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={item.state} onChange={() => item.setState(!item.state)} className="hidden" />
              <span className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ${item.state ? "bg-brand-violet" : "bg-gray-600"}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${item.state ? "translate-x-5" : ""}`}></span>
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Privacy Settings */}
      <div className="p-6 rounded-xl bg-black/50 border border-white/10 shadow-md">
        <h2 className="text-lg font-semibold text-white mb-2">🔒 Privacy Settings</h2>
        <p className="text-sm text-gray-400 mb-4">Control your privacy and visibility preferences.</p>

        {[
          { label: "Public Profile", desc: "Make your profile visible to everyone", state: publicProfile, setState: setPublicProfile },
          { label: "Show Email", desc: "Display your email on your profile", state: showEmail, setState: setShowEmail },
          { label: "Allow Comments", desc: "Let others comment on your thoughts", state: allowComments, setState: setAllowComments },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={item.state} onChange={() => item.setState(!item.state)} className="hidden" />
              <span className={`w-10 h-5 flex items-center rounded-full p-1 duration-300 ${item.state ? "bg-brand-violet" : "bg-gray-600"}`}>
                <span className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${item.state ? "translate-x-5" : ""}`}></span>
              </span>
            </label>
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-xl bg-black/50 border border-red-500/30 shadow-md">
        <h2 className="text-lg font-semibold text-red-500 mb-2">🛑 Danger Zone</h2>
        <p className="text-sm text-gray-400 mb-4">Irreversible and destructive actions.</p>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-50"
        >
          {loading ? "Deleting..." : "🗑️ Delete Account"}
        </button>
      </div>
    </div>
  );
}
