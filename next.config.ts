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
            {
                protocol: "https",
                hostname: "oa4u5iyuv2himekd.public.blob.vercel-storage.com",
                // port: "443",
                pathname: "/profile-images/**", // Allows any image from the 'profile-images' folder
            },
        ],
    },
};

export default nextConfig;
