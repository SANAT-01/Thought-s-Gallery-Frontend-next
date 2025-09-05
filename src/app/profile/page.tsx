"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{ id: string; username: string; email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin"); // redirect if not logged in
      return;
    }

    const id = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    if (id && username && email) {
      setUser({ id, username, email });
    }
  }, [router]);

  if (!user) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 rounded-xl bg-black/50 backdrop-blur-md border border-brand-violet/30 shadow-lg">
      <h1 className="text-2xl font-bold text-brand-violet mb-4">👤 Profile</h1>
      <div className="space-y-3">
        <p><span className="font-semibold text-brand-violet">Username:</span> {user.username}</p>
        <p><span className="font-semibold text-brand-violet">Email:</span> {user.email}</p>
        <p><span className="font-semibold text-brand-violet">User ID:</span> {user.id}</p>
      </div>
    </div>
  );
}
