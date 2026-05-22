import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  // 301/308 redirects preserving links from the old WordPress site.
  async redirects() {
    return [
      { source: '/magazine-4', destination: '/magazine', permanent: true },
      { source: '/feed', destination: '/feed.xml', permanent: true },
      { source: '/feed/', destination: '/feed.xml', permanent: true },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
