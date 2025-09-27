const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignorar erros de tipo durante o build
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar erros de ESLint durante o build
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
