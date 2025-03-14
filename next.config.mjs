/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true, // Ensures App Router is enabled
    },
    output: "standalone", // Required for Vercel deployment
  };
  
  export default nextConfig;
  