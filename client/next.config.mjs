/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack(config, { isServer }) {
    // Ignore all test files from thread-stream
    config.module.rules.push({
      test: /thread-stream\/test/,
      use: 'null-loader', // ignore these files
    });

    return config;
  },
};

export default nextConfig;
