import { useQuery } from "@tanstack/react-query";
import { getCommentByThoughtId } from "../api/comment.service";
import { queryKey } from "@/constants/apiRoutes";

export const useGetCommentByThoughtId = (id: string) => {
    return useQuery({
        queryKey: [queryKey.getCommentByThoughtId, id],
        queryFn: () => getCommentByThoughtId(id),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
