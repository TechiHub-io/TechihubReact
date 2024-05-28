/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  env: {
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
  },
  reactStrictMode: true,
};

export default nextConfig;
