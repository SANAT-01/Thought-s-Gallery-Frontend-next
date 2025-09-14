export const apiRoutes = {
    getAllThought: "/thoughts",
    getThoughtById: "/thought",
    postThought: "/thought",
    getCommentByThoughtId: "/comments", // e.g., /comments?thought_id=123
    postLike: "/like",
    postDislike: "/dislike",
    // profile: "/",
};

export const queryKey = {
    thought: "thoughts",
    getCommentByThoughtId: "comments",
};
