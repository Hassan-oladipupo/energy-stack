const path = require('path');

module.exports = {
  'config': path.resolve(__dirname, 'src/server/config/database.js'),
  'models-path': path.resolve(__dirname, 'src/server/models'),
  'seeders-path': path.resolve(__dirname, 'src/server/seeders'),
  'migrations-path': path.resolve(__dirname, 'src/server/migrations')
};
