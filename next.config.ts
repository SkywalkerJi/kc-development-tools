/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/kc-development-tools',
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/kc-development-tools',
        permanent: true,
        basePath: false
      }
    ];
  }
}

export default nextConfig;
