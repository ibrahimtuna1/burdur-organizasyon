/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase storage
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/**" },
      // Eski siteden resimleri de gösterebiliriz
      { protocol: "https", hostname: "www.organizasyoncum.com", pathname: "/**" },
      { protocol: "https", hostname: "organizasyoncum.com", pathname: "/**" }
    ],
  },
};
export default nextConfig;
