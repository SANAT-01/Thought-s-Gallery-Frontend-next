import { queryKey } from "@/constants/apiRoutes";
import { getThought, postThought } from "@/service/api/thoughts.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import qs from "qs";

export const useGetThoughts = ({
    limit,
    offset,
}: {
    limit?: number;
    offset?: number;
}) => {
    // const query = qs.stringify({ limit, offset });
    return useQuery({
        queryKey: [queryKey.thought, { limit, offset }],
        queryFn: () => getThought({ limit, offset }),
        staleTime: 1000 * 60 * 5, // 5 minutes
        // cacheTime: 1000 * 60 * 10, // 10 minutes
    });
};

export const usePostThoughts = () => {
    return useMutation({
        mutationKey: [queryKey.thought],
        mutationFn: async ({
            payload,
        }: {
            payload: { content: string; user_id: string };
        }) => await postThought(payload),
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // cacheTime: 1000 * 60 * 10, // 10 minutes
    });
};
