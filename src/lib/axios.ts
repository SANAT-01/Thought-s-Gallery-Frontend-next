import { config } from "@/config/config";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { axiosRequestInterceptors } from "./interceptors";

const axiosRequestConfig: AxiosRequestConfig = {
    baseURL: config.API_URL,
    timeout: 1000,
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
};

const axiosInstance: AxiosInstance = axios.create(axiosRequestConfig);

axiosInstance.interceptors.request.use(axiosRequestInterceptors);
axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
        return Promise.reject(err);
    }
);

export { axiosInstance as axios };
