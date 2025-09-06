import { useRouter } from "next/navigation";
import React from "react";

interface ThoughtProps {
  thought: {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    likes: number;
    dislikes: number;
  };
  handleReaction: (id: string, type: "like" | "dislike") => void;
}

const Thought: React.FC<ThoughtProps> = ({ thought, handleReaction }) => {
    const router = useRouter();
  return (
    <div
      key={thought.id}
      onClick={() => {router.push(`/thought/${thought.id}`)}}
      className="glass p-6 rounded-2xl shadow-lg border border-white/10 hover:border-brand-violet/40 transition transform hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Thought content */}
      <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
        {thought.content}
      </p>

      {/* Footer */}
      <div className="mt-5 border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-gray-400">
        <span className="font-mono">
          by <span className="text-brand-violet">User {thought.user_id.slice(0, 6)}...</span>
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
          onClick={() => handleReaction(thought.id, "like")}
          className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white hover:bg-brand-violet/30 transition"
        >
          👍 <span>{thought.likes}</span>
        </button>
        <button
          onClick={() => handleReaction(thought.id, "dislike")}
          className="glass px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white hover:bg-red-600/30 transition"
        >
          👎 <span>{thought.dislikes}</span>
        </button>
      </div>
    </div>
  );
};

export default Thought;
