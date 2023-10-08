const withImages = require('next-images');

const isProd = process.env.NODE_ENV = 'production';

const nextConfig = {    
  basePath: isProd ? '/incrementalrelic' : '',
  output: 'export',
};

module.exports = withImages(nextConfig);
