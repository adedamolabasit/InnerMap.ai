/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /thread-stream\/test/,
      use: 'null-loader', 
    });

    return config;
  },
};

export default nextConfig;
