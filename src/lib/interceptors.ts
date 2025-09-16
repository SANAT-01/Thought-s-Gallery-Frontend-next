import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

export interface ConsoleError {
    status: number;
    data: unknown;
}

export const axiosRequestInterceptors = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        delete config.headers.Authorization;
    }
    config.withCredentials = true; // Include credentials in requests
    return config;
};

export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
    return response;
};

export const errorInterceptor = async (
    error: AxiosError
): Promise<AxiosError | null> => {
    if (error.response?.status === 401) {
        console.log(error);
        console.log(window.location.pathname);
        if (!window.location.pathname.includes("/signin"))
            window.location.href = `${window.location.origin}/signin?redirectTo=${window.location.pathname}`;
        return null;
    } else {
        if (error.response) {
            const errorMessage: ConsoleError = {
                status: error.response.status,
                data: error.response.data,
            };
            console.error(errorMessage);
            return await Promise.reject(errorMessage);
        } else if (error.request) {
            console.error(error.request);
        } else {
            console.error("Error", error.message);
        }
    }
    return await Promise.reject(error);
};
