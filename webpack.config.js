const path = require('path');

module.exports = {
  entry: './osm_jet/static/jet/js/src/main.js',
  output: {
    path: path.resolve(__dirname, 'osm_jet/static/jet/js/build'),
    filename: 'bundle.min.js'
  }
};
