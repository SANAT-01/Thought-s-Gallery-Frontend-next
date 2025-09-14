import { queryKey } from "@/constants/apiRoutes";
import { getThought } from "@/service/api/thoughts.service";
import { useQuery } from "@tanstack/react-query";

export const useThoughts = () => {
    return useQuery({
        queryKey: [queryKey.thought],
        queryFn: () => getThought(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        // cacheTime: 1000 * 60 * 10, // 10 minutes
    });
};
