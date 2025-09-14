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

export interface ThoughtType {
    id: string;
    content: string;
    user_id: string;
    created_at: string;
    username: string;
    profile_picture: string;
    liked_by_users: user[];
    disliked_by_users: user[];
    comments: comment[];
}
