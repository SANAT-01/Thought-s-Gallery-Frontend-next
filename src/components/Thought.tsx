import {
    ChatBubbleBottomCenterIcon,
    HandThumbDownIcon,
    HandThumbUpIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

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

interface ThoughtProps {
    thought: {
        id: string;
        content: string;
        user_id: string;
        created_at: string; // ISO timestamp
        username: string;
        profile_picture: string;
        liked_by_users: user[];
        disliked_by_users: user[];
        comments: comment[];
    };

    handleReaction: (id: string, type: "like" | "dislike") => void;
}

const Thought: React.FC<ThoughtProps> = ({ thought, handleReaction }) => {
    // const [isLiked, setIsLiked] = useState(false); // Track if the user has liked the thought
    // const [isDisliked, setIsDisliked] = useState(false); // Track if the user has disliked the thought
    // const [isSubmitting, setIsSubmitting] = useState(false); // For disabling buttons during API calls

    const router = useRouter();
    console.log(thought);
    return (
        <div
            key={thought.id}
            onClick={() => {
                router.push(`/thought/${thought.id}`);
            }}
            className="glass cursor-pointer p-6 rounded-2xl shadow-lg border border-white/10 hover:border-brand-violet/40 transition transform hover:-translate-y-1 hover:shadow-xl"
        >
            {/* Thought content */}
            <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                {thought.content}
            </p>

            {/* Footer */}
            <div className="mt-5 border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-400">
                <span
                    className="font-mono hover:text-brand-violet transition"
                    // onClick={() =>
                    //     router.push(
                    //         thought.user_id === localStorage.getItem("user_id")
                    //             ? `/profile`
                    //             : `/user/${thought.user_id}`
                    //     )
                    // }
                >
                    <div className="flex items-center gap-2">
                        {thought.profile_picture ? (
                            <Image
                                width={28}
                                height={28}
                                src={thought.profile_picture}
                                alt={thought.username}
                                className="w-7 h-7 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-brand-violet flex items-center justify-center text-2xl font-bold text-white">
                                {thought.username.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-brand-violet">
                            {thought.user_id === localStorage.getItem("user_id")
                                ? "You"
                                : thought.username}
                        </span>
                    </div>
                </span>
                <span>
                    {new Date(thought.created_at).toLocaleDateString()} •{" "}
                    {new Date(thought.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>

            {/* Reactions */}
            <div className="flex items-center gap-4 mt-5">
                <button
                    // onClick={() => handleReaction(thought.id, "like")}
                    className={`glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                        thought.liked_by_users.find(
                            (user) =>
                                user.id === localStorage.getItem("user_id")
                        )
                            ? "text-red-600"
                            : "text-white"
                    } hover:bg-brand-violet/30 transition`}
                >
                    <HandThumbUpIcon className="h-4 w-4" />
                    <span>{thought.liked_by_users.length}</span>
                </button>
                <button
                    // onClick={() => handleReaction(thought.id, "dislike")}
                    className={`glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium ${
                        thought.disliked_by_users.find(
                            (user) =>
                                user.id === localStorage.getItem("user_id")
                        )
                            ? "text-red-600"
                            : "text-white"
                    } hover:bg-brand-violet/30 transition`}
                >
                    <HandThumbDownIcon className="h-4 w-4" />
                    <span>{thought.disliked_by_users.length}</span>
                </button>
                <button
                    // onClick={() => handleReaction(thought.id, "dislike")}
                    className={`glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white transition`}
                >
                    {
                        <ChatBubbleBottomCenterIcon className="text-gray-400 w-4 h-4" />
                    }
                    <span>{thought.comments.length}</span>
                </button>
            </div>
        </div>
    );
};

export default Thought;
