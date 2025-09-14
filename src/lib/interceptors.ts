import { InternalAxiosRequestConfig } from "axios";

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
