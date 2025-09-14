import { queryKey } from "@/constants/apiRoutes";
import { useMutation } from "@tanstack/react-query";
import { postDislike, postLike } from "../api/interaction.service";

export const usePostLike = () => {
    return useMutation({
        mutationKey: [queryKey.thought],
        mutationFn: async ({
            thoughtId,
            payload,
        }: {
            thoughtId: string;
            payload: { userId: string };
        }) => await postLike(thoughtId, payload),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // cacheTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const usePostDislike = () => {
    return useMutation({
        mutationKey: [queryKey.thought],
        mutationFn: async ({
            thoughtId,
            payload,
        }: {
            thoughtId: string;
            payload: { userId: string };
        }) => await postDislike(thoughtId, payload),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // cacheTime: 1000 * 60 * 10, // 10 minutes
    });
};
