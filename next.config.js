/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    if (!isServer) {
      // Stub out the React Native AsyncStorage shim that @metamask/sdk
      // pulls in transitively — it doesn't exist in the browser bundle
      // and throws a runtime module-not-found error without this alias.
      config.resolve.alias = {
        ...config.resolve.alias,
        '@react-native-async-storage/async-storage': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
