// frontend/next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://be-instrumentos.vercel.app/:path*', // Proxy to Backend
      },
    ];
  },
};
