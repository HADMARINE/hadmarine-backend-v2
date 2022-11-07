// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageData = require('./package.json');

const apps = [
  {
    name: packageData.name,
    exec_mode: 'cluster',
    instances: 'max',
    script: './dist/src/main.js',
    watch: false,
    env: {
      NODE_ENV: 'production',
    },
  },
];

module.exports = {
  apps,
};
