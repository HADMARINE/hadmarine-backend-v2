import { name as _name } from './package.json';

export const apps = [
  {
    name: _name,
    exec_mode: 'cluster',
    instances: 'max',
    script: './dist/index.js',
    watch: false,
    env: {
      NODE_ENV: 'production',
    },
  },
];
