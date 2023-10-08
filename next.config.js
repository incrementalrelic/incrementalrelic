
const isProd = process.env.NODE_ENV == 'production';

const nextConfig = {    
  basePath: isProd ? '/incrementalrelic' : '',
  output: 'export',
};

module.exports = nextConfig;
