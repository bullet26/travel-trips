import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
        search: '',
      },
    ],
  },
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  webpack: (config) => {
    if (!config) {
      throw new Error('Webpack config is undefined')
    }

    config.module.rules = config.module.rules.map(
      (rule: { test: { toString: () => string | string[] } }) => {
        if (rule && rule.test && rule.test.toString().includes('svg')) {
          return { ...rule, exclude: /\.svg$/i }
        }
        return rule
      },
    )

    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: { icon: true },
          },
        ],
      },
      {
        test: /\.svg$/i,
        issuer: /\.(css|scss|sass)$/,
        type: 'asset/resource',
      },
    )

    return config
  },
}

export default nextConfig
