import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Разрешаем доступ с других устройств в локальной сети
    allowedDevOrigins: ['192.168.0.100', '*.local']
};

export default nextConfig;
