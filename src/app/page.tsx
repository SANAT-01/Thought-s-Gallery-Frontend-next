"use client";

import Thought from "@/components/Thought";
import { useGetThoughts, usePostThoughts } from "@/service/query/thought.query";
import { showToast } from "@/store/slices/toastSlice";
import { ThoughtType } from "@/types/thoughtType";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const ITEMS_PER_PAGE = 5;

export default function HomePage() {
    const [thoughts, setThoughts] = useState<ThoughtType[]>([]);
    const [newThought, setNewThought] = useState("");
    const [newPageLoading, setNewPageLoading] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const [offset, setOffset] = useState(0);
    const router = useRouter();
    const dispatch = useDispatch();

    const observerRef = useRef<HTMLDivElement | null>(null);

    const {
        data: thoughtsData,
        isLoading: thoughtsLoading,
        isFetching, // Tracks ongoing fetches
    } = useGetThoughts({ limit: ITEMS_PER_PAGE, offset: offset }); // ✅ Use limit and offset states

    const {
        mutateAsync: postThought,
        isPending: posting,
        isSuccess,
    } = usePostThoughts();

    // Handle initial fetch and subsequent fetches
    useEffect(() => {
        // Only append data if a new page is loaded and not during the initial empty state
        if (!thoughtsLoading && thoughtsData?.data) {
            if (thoughtsData.data.length < ITEMS_PER_PAGE) {
                setIsLastPage(true); // No more pages to load
            }
            setThoughts((prevThoughts) => [
                ...prevThoughts,
                ...thoughtsData.data,
            ]);
        }
    }, [thoughtsData, thoughtsLoading]);

    // Handle Intersecting for Infinite Scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // If the sentinel div is intersecting and we are not already fetching
                if (entries[0].isIntersecting && !isFetching && !isLastPage) {
                    setNewPageLoading(true);
                    setTimeout(() => {
                        setOffset((prevOffset) => prevOffset + ITEMS_PER_PAGE);
                        setNewPageLoading(false);
                    }, 2000); // 2000 ms = 2 seconds
                }
            },
            { threshold: 1 }
        );

        const currentRef = observerRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [isFetching]); // ✅ Dependency array must include isFetching to prevent multiple simultaneous fetches

    // Handle initial authentication check
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/signin");
        }
    }, [router]);

    // Handle post success feedback
    useEffect(() => {
        if (isSuccess) {
            dispatch(
                showToast({
                    type: "success",
                    message: "Successfully posted thought",
                })
            );
        }
    }, [isSuccess, dispatch]);

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newThought.trim()) return;
        const user_id = localStorage.getItem("user_id"); // ✅ get user id
        try {
            const data = await postThought({
                payload: { content: newThought, user_id: user_id! },
            });
            if (data.success) {
                setThoughts([
                    {
                        ...data.data,
                        liked_by_users: [],
                        disliked_by_users: [],
                        comments: [],
                    },
                    ...thoughts,
                ]); // prepend
                setNewThought("");
            }
        } catch (err) {
            dispatch(
                showToast({
                    type: "error",
                    message: "Failed to post thought",
                })
            );
        }
    };

    if (thoughtsLoading && offset === 0) {
        return (
            <main className="flex min-h-screen items-center justify-center text-gray-400">
                Loading thoughts...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground p-6">
            <h1 className="text-3xl font-bold text-center text-brand-violet mb-8">
                Thought’s Gallery
            </h1>

            {/* Post Thought Form */}
            <form
                onSubmit={handlePost}
                className="glass max-w-xl mx-auto mb-8 p-4 rounded-xl shadow-lg border border-brand-violet/30"
            >
                <textarea
                    placeholder="Share your thought..."
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
                {thoughts.map((thought, index) => (
                    <div key={index}>
                        <Thought thought={thought} />
                    </div>
                ))}
            </div>
            {/* Loading more indicator */}
            {isFetching || newPageLoading ? (
                <div className="text-center text-gray-400 mt-4">
                    Loading more thoughts...
                </div>
            ) : (
                <div ref={observerRef} className="h-24"></div>
            )}
        </main>
    );
}
