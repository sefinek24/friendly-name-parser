const prettyOutput = require('./utils/pretty.js');

const patterns = {
	html: /<\/?[a-z][\s\S]*>/i,
	js: /\b(function|var|let|const|if|for|while|switch|return|alert)\b/,
	php: /<\?php[\s\S]*\?>/i,
	breakSpaces: /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u2028\u2029\u2006\u2001\u2002\u2003\u2004\u2005\u2007\u2008\u2009\u200A]/g,
	multilineComments: /\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->|#.*(?:\r?\n|$)/
};

module.exports = inputString => {
	const results = {
		input: inputString,
		pretty: prettyOutput(inputString, patterns.breakSpaces),
		isHTML: patterns.html.test(inputString),
		isJS: patterns.js.test(inputString),
		isPHP: patterns.php.test(inputString),
		breakSpaces: patterns.breakSpaces.test(inputString),
		hasMultilineComments: patterns.multilineComments.test(inputString)
	};

	results.isPlainText = !Object.values(results).includes(true);
	results.detected = Object.keys(results)
		.filter(key => results[key] === true && key !== 'isPlainText')
		.map(key => key.replace('is', '')
			.replace('breakSpaces', 'Break spaces')
			.replace('hasMultilineComments', 'Multiline comments'));

	return results;
};