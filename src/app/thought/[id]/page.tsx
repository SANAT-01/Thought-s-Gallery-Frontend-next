"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Updated Thought interface to include the current user's action
interface Thought {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    likes: number;
    dislikes: number;
    username: string;
    profile_picture?: string;
    user_action: "liked" | "disliked" | null; // e.g., 'liked', 'disliked', or null
}

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    username: string;
    profile_picture?: string;
}

export default function ThoughtDetailPage() {
    const { id } = useParams(); // 🔹 /thought/[id]
    const [thought, setThought] = useState<Thought>({
        id: "",
        content: "",
        user_id: "",
        created_at: "",
        likes: 0,
        dislikes: 0,
        user_action: null,
        username: "",
        profile_picture: "",
    });
    const [isLiked, setIsLiked] = useState(false); // Track if the user has liked the thought
    const [isDisliked, setIsDisliked] = useState(false); // Track if the user has disliked the thought
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // For disabling buttons during API calls

    const router = useRouter();

    // --- Fetch Initial Data ---
    useEffect(() => {
        if (!id) return;

        const fetchThought = async () => {
            const res = await fetch(
                // Note: A more RESTful convention would be /api/thoughts/${id}
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );
            const likes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought/${id}/likes`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );
            const dislikes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought/${id}/dislikes`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );
            const likesData = await likes.json();
            const dislikesData = await dislikes.json();
            setIsLiked(
                likesData.data.some(
                    (like: { user_id: string }) =>
                        like.user_id === localStorage.getItem("user_id")
                )
            );
            setIsDisliked(
                dislikesData.data.some(
                    (dislike: { user_id: string }) =>
                        dislike.user_id === localStorage.getItem("user_id")
                )
            );
            // console.log(likesData, dislikesData);
            const data = await res.json();
            if (data.success)
                setThought({
                    ...data.data,
                    likes: likesData.data.length,
                    dislikes: dislikesData.data.length,
                });
        };

        const fetchComments = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought/${id}/comments`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );
            const data = await res.json();
            if (data.success) setComments(data.data);
        };

        fetchThought();
        fetchComments();
    }, [id]);

    // --- Handle Like/Dislike Interaction ---
    const handleInteraction = async (type: "like" | "dislike") => {
        if (isSubmitting || !id) return;
        setIsSubmitting(true);
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

            // If successful, the API should return the updated thought object
            if (data.success) {
                setThought((prev) => {
                    return {
                        ...prev,
                        likes:
                            type === "like"
                                ? isLiked
                                    ? prev.likes - 1
                                    : prev.likes + 1
                                : isLiked
                                ? prev.likes - 1
                                : prev.likes,
                        dislikes:
                            type === "dislike"
                                ? isDisliked
                                    ? prev.dislikes - 1
                                    : prev.dislikes + 1
                                : isDisliked
                                ? prev.dislikes - 1
                                : prev.dislikes,
                        user_action: type === "like" ? "liked" : "disliked",
                    };
                });
                setIsLiked((prev) => (type === "like" ? !prev : false));
                setIsDisliked((prev) => (type === "dislike" ? !prev : false));
            }
        } catch (error) {
            console.error(`Failed to post ${type}:`, error);
            // Optionally, show an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Handle Comment Submission ---
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/thought/${id}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                    body: JSON.stringify({
                        content: newComment,
                        userId: localStorage.getItem("user_id"),
                    }),
                }
            );

            const data = await res.json();
            if (data.success) {
                setComments([data.data, ...comments]);
                setNewComment("");
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!thought)
        return <div className="text-center py-20 text-white">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            {/* Thought Card */}
            <div className="glass p-6 rounded-2xl shadow-lg mb-8">
                <h1 className="text-xl font-bold text-white mb-4">
                    {thought.content}
                </h1>
                <div className="flex justify-between text-sm text-gray-400">
                    <span
                        className="hover:text-brand-violet cursor-pointer"
                        onClick={() =>
                            router.push(
                                thought.user_id ===
                                    localStorage.getItem("user_id")
                                    ? `/profile`
                                    : `/user/${thought.user_id}`
                            )
                        }
                    >
                        {thought.user_id === localStorage.getItem("user_id")
                            ? "You"
                            : thought.username}
                    </span>
                    <span>
                        {new Date(thought.created_at).toLocaleDateString()} •{" "}
                        {new Date(thought.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                </div>
                <div className="flex gap-4 mt-4">
                    <button
                        onClick={() => handleInteraction("like")}
                        disabled={isSubmitting}
                        className={`glass px-3 py-1 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50 ${
                            isLiked
                                ? "bg-red-600 text-red-600"
                                : "hover:bg-brand-violet/30 text-white"
                        }`}
                    >
                        👍 {thought.likes}
                    </button>
                    <button
                        onClick={() => handleInteraction("dislike")}
                        disabled={isSubmitting}
                        className={`glass px-3 py-1 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50 ${
                            isDisliked
                                ? "bg-red-600 text-red-600"
                                : "hover:bg-red-600/30 text-white"
                        }`}
                    >
                        👎 {thought.dislikes}
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            <div className="glass p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-semibold text-brand-violet mb-4">
                    Comments
                </h2>

                <form
                    onSubmit={handleCommentSubmit}
                    className="flex gap-2 mb-6"
                >
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 rounded-lg bg-black/50 border border-white/10 focus:ring-2 focus:ring-brand-violet text-white text-sm"
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-brand-violet hover:bg-brand-violet-dark rounded-lg text-white text-sm disabled:opacity-50"
                        disabled={isSubmitting || !newComment.trim()}
                    >
                        Post
                    </button>
                </form>

                {comments.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                        No comments yet. Be the first!
                    </p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((c) => (
                            <div
                                key={c.id}
                                className="border-b border-white/10 pb-2"
                            >
                                <p className="text-sm text-white">
                                    {c.content}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {c.username} •{" "}
                                    {new Date(
                                        c.created_at
                                    ).toLocaleDateString()}{" "}
                                    {new Date(c.created_at).toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
