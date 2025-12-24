/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  reactCompiler: true,

  images: {
    unoptimized: true,
    remotePatterns: [
      {
        // protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vendor-products-media.s3.ap-south-1.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactCompiler: true,
  
//   images: {
//     domains: ['res.cloudinary.com'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'raw.githubusercontent.com',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },

//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:8001/api/:path*', // 👈 FastAPI backend proxy
//       },
//     ];
//   },
// };

// export default nextConfig;
