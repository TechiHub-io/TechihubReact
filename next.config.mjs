// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "api.techhub.example.com",
      "techihub-resources.s3.amazonaws.com",
    ],
    formats: ["image/avif", "image/webp"],
  },
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1",
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_FRONT_URL || "http://localhost:8000/api/v1";
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;