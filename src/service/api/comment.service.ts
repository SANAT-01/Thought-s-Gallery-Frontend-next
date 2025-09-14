import { apiRoutes } from "@/constants/apiRoutes";
import { axios } from "@/lib/axios";

export const getCommentByThoughtId = async (id: string) => {
    const response = await axios.get(
        `${apiRoutes.getThoughtById}/${id}${apiRoutes.getCommentByThoughtId}`
    );
    return response.data;
};
