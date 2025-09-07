import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "5173",
                pathname: "/uploads/**", // Allows any image from the 'uploads' folder
            },
        ],
    },
};

export default nextConfig;
