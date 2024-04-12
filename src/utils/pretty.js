const urlRegex = /https?:\/\/\S+/g;
const emailRegex = /(\S+)@\S+\.\S+/g;
const htmlTagRegex = /<[^>]*>/g;
const phpTagRegex = /<\?php.*?\?>/gs;
const reservedWordRegex = /\b(const|let|var|function|alert)\b/gi;
const invalidCharsRegex = /[^a-z0-9\s'ąęółśżźćńĄĘÓŁŚŻŹĆŃ~]/gi;
const multipleDotsRegex = /\.{2,}/g;
const excessiveSpacesRegex = /\s{3,}/g;
const spaceBeforePunctuationRegex = /\s([,.])/g;

const lowerCaseWords = new Set(['the', 'a', 'an', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by']);
const specialCases = {
	'html': 'HTML',
	'css': 'CSS',
	'js': 'JS',
	'javascript': 'JavaScript',
};

module.exports = (inputString, breakSpaces) => {
	const emailMatch = inputString.match(emailRegex);
	if (emailMatch) {
		const email = emailMatch[0];
		const username = email.split('@')[0];
		const cleanUsername = username
			.replace(/[^\w\s]/gi, '')
			.split(/\s+/)
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join('');

		if (cleanUsername.length >= 4) return cleanUsername;
	}

	return inputString
		.replace(urlRegex, '')
		.replace(breakSpaces, '')
		.replace(htmlTagRegex, '')
		.replace(phpTagRegex, '')
		.replace(reservedWordRegex, '')
		.toLowerCase()
		.replace(invalidCharsRegex, '')
		.replace(multipleDotsRegex, '.')
		.replace(excessiveSpacesRegex, ' ')
		.replace(spaceBeforePunctuationRegex, '$1')
		.split(/\s+/)
		.map((word, index) => {
			word = specialCases[word.toLowerCase()] || word;

			if (index === 0 || !lowerCaseWords.has(word.toLowerCase())) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			} else {
				return word.toLowerCase();
			}
		})
		.join(' ')
		.replace(/\s{2,}/g, ' ')
		.replace(/\.$/, '')
		.trim();
};
