"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { HandThumbDownIcon, HandThumbUpIcon } from "@heroicons/react/24/solid";
import { useGetThoughtById } from "@/service/query/thought.query";
import { useGetCommentByThoughtId } from "@/service/query/comment.query";
import { usePostDislike, usePostLike } from "@/service/query/interaction.query";
import { comment, ThoughtType } from "@/types/thoughtType";
import LoaderSpinner from "@/components/SpinnerComponent";

const ThoughtDetailPage = () => {
    const { id } = useParams() as { id: string }; // 🔹 /thought/[id]
    const [thought, setThought] = useState<ThoughtType>({
        id: "",
        content: "",
        user_id: "",
        created_at: "",
        liked_by: [],
        disliked_by: [],
        user_action: null,
        username: "",
        profile_picture: "",
    });
    const [comments, setComments] = useState<comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const router = useRouter();
    const [interactionState, setInteractionState] = useState<{
        liked: number;
        disliked: number;
        currentAction?: "liked" | "disliked" | null;
    }>({ liked: 0, disliked: 0 });

    const { data: thoughtData, isLoading: thoughtLoading } = useGetThoughtById({
        id: id?.toString() || "",
        user_id: localStorage.getItem("user_id") || "",
    });

    const { data: commentsData, isLoading: commentsLoading } =
        useGetCommentByThoughtId(id?.toString() || "");

    const {
        mutateAsync: postLike,
        isPending: liking,
        isSuccess: likeSuccess,
    } = usePostLike();

    const {
        mutateAsync: postDislike,
        isPending: disliking,
        isSuccess: disSuccess,
    } = usePostDislike();

    useEffect(() => {
        if (thoughtData && thoughtData.success) {
            setThought(thoughtData.data);
            setInteractionState({
                liked: thoughtData.data.liked_by.length,
                disliked: thoughtData.data.disliked_by.length,
                currentAction: thoughtData.data.user_action,
            });
        }
    }, [thoughtData]);

    useEffect(() => {
        if (commentsData && commentsData.success)
            setComments(commentsData.data);
    }, [commentsData]);

    // --- Handle Like/Dislike Interaction ---
    const handleInteraction = async (type: "like" | "dislike") => {
        if (liking || !id) return;

        try {
            if (type === "like") {
                await postLike({
                    thoughtId: id,
                    payload: { userId: localStorage.getItem("user_id") || "" },
                });
            } else {
                await postDislike({
                    thoughtId: id,
                    payload: { userId: localStorage.getItem("user_id") || "" },
                });
            }
            setInteractionState((prev) => {
                let { liked, disliked, currentAction } = prev;

                if (type === "like") {
                    if (currentAction === "liked") {
                        liked -= 1;
                        currentAction = null;
                    } else {
                        liked += 1;
                        if (currentAction === "disliked") disliked -= 1;
                        currentAction = "liked";
                    }
                } else {
                    if (currentAction === "disliked") {
                        disliked -= 1;
                        currentAction = null;
                    } else {
                        disliked += 1;
                        if (currentAction === "liked") liked -= 1;
                        currentAction = "disliked";
                    }
                }

                return { liked, disliked, currentAction };
            });
        } catch (error) {
            console.error(`Failed to post ${type}:`, error);
        }
    };

    // --- Handle Comment Submission ---
    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/thought/${id}/comments`,
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
        }
    };

    if (thoughtLoading || commentsLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderSpinner />
            </div>
        );

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            {/* Thought Card */}
            <div className="glass flex p-6 rounded-2xl shadow-lg mb-8">
                <div className="mr-4">
                    {thought.profile_picture ? (
                        <Image
                            width={56}
                            height={56}
                            src={thought.profile_picture ?? ""}
                            alt={thought.username}
                            className="w-14 h-14 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-brand-violet flex items-center justify-center text-2xl font-bold text-white">
                            {thought.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="w-full">
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
                            {new Date(thought.created_at).toLocaleDateString()}{" "}
                            •{" "}
                            {new Date(thought.created_at).toLocaleTimeString(
                                [],
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }
                            )}
                        </span>
                    </div>
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => handleInteraction("like")}
                            disabled={liking}
                            className={`glass px-3 w-[65px] py-1 flex items-center cursor-pointer rounded-lg text-sm transition-colors duration-200 disabled:opacity-50  ${
                                interactionState.currentAction === "liked"
                                    ? "bg-red-600 text-red-600"
                                    : "hover:bg-brand-violet/30 text-white"
                            }`}
                        >
                            <HandThumbUpIcon className="h-4 w-4 mr-2" />
                            {interactionState.liked}
                        </button>
                        <button
                            onClick={() => handleInteraction("dislike")}
                            disabled={disliking}
                            className={`glass px-3 w-[65px] flex items-center py-1 cursor-pointer rounded-lg text-sm transition-colors duration-200 disabled:opacity-50 ${
                                interactionState.currentAction === "disliked"
                                    ? "bg-red-600 text-red-600"
                                    : "hover:bg-red-600/30 text-white"
                            }`}
                        >
                            <HandThumbDownIcon className="h-4 w-4 mr-2" />
                            {interactionState.disliked}
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="glass p-6 h-[500px] rounded-2xl shadow-lg">
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
                        disabled={liking}
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-brand-violet hover:bg-brand-violet-dark rounded-lg text-white text-sm disabled:opacity-50"
                        disabled={liking || !newComment.trim()}
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
                                <div className="flex items-center gap-2">
                                    {c.user.profile_picture ? (
                                        <Image
                                            width={28}
                                            height={28}
                                            src={c.user.profile_picture}
                                            alt={c.user.username}
                                            className="w-7 h-7 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-7 h-7 rounded-full bg-brand-violet flex items-center justify-center text-2xl font-bold text-white">
                                            {c?.user.username
                                                ?.charAt(0)
                                                ?.toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-white">
                                            {c.content}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {c.user.username} •{" "}
                                            {new Date(
                                                c?.created_at ?? ""
                                            ).toLocaleDateString()}{" "}
                                            {new Date(
                                                c?.created_at ?? ""
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThoughtDetailPage;
