import { apiRoutes } from "@/constants/apiRoutes";
import { axios } from "@/lib/axios";

export const getThought = async () => {
    const response = await axios.get(apiRoutes.thought);
    return response.data;
};
