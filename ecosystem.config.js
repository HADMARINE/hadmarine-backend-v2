const packageData = require('./package.json');

export const apps = [
  {
    name: packageData.name,
    exec_mode: 'cluster',
    instances: 'max',
    script: './dist/index.js',
    watch: false,
    env: {
      NODE_ENV: 'production',
    },
  },
];
