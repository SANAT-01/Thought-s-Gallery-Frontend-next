import { apiRoutes } from "@/constants/apiRoutes";
import { axios } from "@/lib/axios";

export const getThought = async ({
    limit,
    offset,
}: {
    limit?: number;
    offset?: number;
}) => {
    const response = await axios.get(apiRoutes.getThought, {
        params: { limit, offset },
    });
    return response.data;
};

export const postThought = async (data: {
    content: string;
    user_id: string;
}) => {
    const response = await axios.post(apiRoutes.postThought, data);
    return response.data;
};
