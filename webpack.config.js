const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'production',
	output: {
		filename: 'pretty-username.min.js',
		path: path.resolve(__dirname, 'dist'),
		library: 'prettyUsername',
		libraryTarget: 'window',
	},
	devtool: 'source-map',
};