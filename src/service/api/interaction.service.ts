import { apiRoutes } from "@/constants/apiRoutes";
import { axios } from "@/lib/axios";

export const postLike = async (
    thoughtId: string,
    payload: { userId: string }
) => {
    const response = await axios.post(
        `${apiRoutes.getThoughtById}/${thoughtId}${apiRoutes.postLike}`,
        payload
    );
    return response.data;
};

export const postDislike = async (
    thoughtId: string,
    payload: { userId: string }
) => {
    const response = await axios.post(
        `${apiRoutes.getThoughtById}/${thoughtId}${apiRoutes.postDislike}`,
        payload
    );
    return response.data;
};
