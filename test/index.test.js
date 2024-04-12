const FriendlyNameParser = require('../src/index.js');

describe('Validator Tests', () => {
	describe('#isHTML', () => {
		test('Detects simple <h1> tag', () => {
			const { isHTML } = FriendlyNameParser('<h1>Hello world!</h1>');
			expect(isHTML).toBe(true);
		});

		test('Detects simple <code> tag', () => {
			const { isHTML } = FriendlyNameParser('<code>Hello</code>');
			expect(isHTML).toBe(true);
		});

		test('Detects <script> tag with JavaScript code', () => {
			const { isHTML } = FriendlyNameParser('<script>let say = "meow!";</script>');
			expect(isHTML).toBe(true);
		});
	});

	describe('#isJS', () => {
		test('Identifies HTTP server code snippet', () => {
			const { isJS } = FriendlyNameParser('// server.mjs\n' +
					'import { createServer } from \'node:http\';\n' +
					'const server = createServer((req, res) => {\n' +
					'  res.writeHead(200, { \'Content-Type\': \'text/plain\' });\n' +
					'  res.end(\'Hello World!\\n\');\n' +
					'});\n' +
					'server.listen(3000, \'127.0.0.1\', () => {\n' +
					'  console.log(\'Listening on 127.0.0.1:3000\');\n' +
					'});\n');
			expect(isJS).toBe(true);
		});

		test('Identifies Express.js server setup code', () => {
			const { isJS } = FriendlyNameParser('const express = require(\'express\')\n' +
					'const router = express.Router()\n' +
					'router.use((req, res, next) => {\n' +
					'  console.log(\'Time: \', Date.now())\n' +
					'  next()\n' +
					'})\n' +
					'router.get(\'/\', (req, res) => {\n' +
					'  res.send(\'Birds home page\')\n' +
					'})\n' +
					'router.get(\'/about\', (req, res) => {\n' +
					'  res.send(\'About birds\')\n' +
					'})\n' +
					'module.exports = router');
			expect(isJS).toBe(true);
		});
	});

	describe('#isPHP', () => {
		test('Detects simple PHP echo statement', () => {
			const { isPHP } = FriendlyNameParser('<?php echo "I really hate PHP"; ?>');
			expect(isPHP).toBe(true);
		});
	});

	describe('#breakSpaces', () => {
		test('Detects break spaces', () => {
			const { breakSpaces } = FriendlyNameParser('Hello w orld!');
			expect(breakSpaces).toBe(true);
		});
	});
});

describe('Pretty FriendlyNameParsers', () => {
	test('Removes <h1> tag', () => {
		const { pretty } = FriendlyNameParser('<h1>Hello world!</h1>');
		expect(pretty).toBe('Hello World');
	});

	test('Removes <code> tag', () => {
		const { pretty } = FriendlyNameParser('<code>const cat = "Keyboard cat";</code>');
		expect(pretty).toBe('Cat Keyboard Cat');
	});

	test('Removes <script> tag', () => {
		const { pretty } = FriendlyNameParser('<script>alert("Neko~chan")</script>');
		expect(pretty).toBe('Neko~chan');
	});

	test('Extracts FriendlyNameParser from email address', () => {
		const { pretty } = FriendlyNameParser('vfdg fdsa dfsa <?>#0@$%<?ó@>#$<%@ł#$ż?>%ń<@#?> $SefInek.@gmail.com j asdfasd afsdf asd fasdj');
		expect(pretty).toBe('Sefinek');
	});

	test('Removes URLs', () => {
		const { pretty } = FriendlyNameParser('Sefinek (https://sefinek.net)');
		expect(pretty).toBe('Sefinek');
	});

	test('Removes multiple URLs', () => {
		const { pretty } = FriendlyNameParser('/.  https://d  kEYboard cat https://github.com/sefinek24?tab=repositories ./ ');
		expect(pretty).toBe('Keyboard Cat');
	});

	test('Correctly converts Polish names', () => {
		const { pretty } = FriendlyNameParser('GRzegorz Brzęczyszczykiewicz');
		expect(pretty).toBe('Grzegorz Brzęczyszczykiewicz');
	});

	test('Correctly trims text', () => {
		const { pretty } = FriendlyNameParser('			I love 	cats ');
		expect(pretty).toBe('I Love Cats');
	});

	test('Removes emojis', () => {
		const { pretty } = FriendlyNameParser('Meow! 🐱🐱🐱');
		expect(pretty).toBe('Meow');
	});

	test('Removes multiple emojis', () => {
		const { pretty } = FriendlyNameParser('!!😸S😸e😸f😸i😸!!');
		expect(pretty).toBe('Sefi');
	});

	test('Handles sentences with emojis correctly', () => {
		const { pretty } = FriendlyNameParser('Quick fox🦊 jumps over^ the lazy <- dog🐶.');
		expect(pretty).toBe('Quick Fox Jumps Over the Lazy Dog');
	});

	test('Correctly removes characters from both sides', () => {
		const { pretty } = FriendlyNameParser('.-^Just a cat^-.');
		expect(pretty).toBe('Just a Cat');
	});

	test('Handles long strings with links and emojis', () => {
		const { pretty } = FriendlyNameParser('🦀🦐🦪🐚 !!!!!!!!!!!!!I AM  JUST A FISH!!!!!!!!!!!! 😭🐟🐠🦈🐡🐬🐳🐋🦭🐙🦑🦞https://www.youtube.com/watch?v=1goAp0XmhZQ🐌🦋🐛🐜🐝🐞🦗🦂🦟🦠🐢🐍🦎🦖🦕🐙🦑https://www.youtube.com/watch?v=1goAp0XmhZQ    ');
		expect(pretty).toBe('I Am Just a Fish');
	});

	test('Removes non-breaking spaces correctly', () => {
		const { pretty } = FriendlyNameParser('S e F i N e K');
		expect(pretty).toBe('Sefinek');
	});

	describe('Additional tests', () => {
		test('Identifies and removes markdown links', () => {
			const { pretty } = FriendlyNameParser('Check out my [blog](https://myblog.com)!');
			expect(pretty).toBe('Check Out My Blog');
		});

		test('Correctly processes nested HTML tags', () => {
			const { pretty } = FriendlyNameParser('<div><span>Nested <b>HTML</b> content</span></div>');
			expect(pretty).toBe('Nested HTML Content');
		});

		test('Handles string with special characters', () => {
			const { pretty } = FriendlyNameParser('Special &characters* should# be$ cleaned@ up%!');
			expect(pretty).toBe('Special Characters Should Be Cleaned Up');
		});

		test('Correctly capitalizes mixed case strings', () => {
			const { pretty } = FriendlyNameParser('mIxEd CaSe StRiNgS should be normalized');
			expect(pretty).toBe('Mixed Case Strings Should Be Normalized');
		});
	});
});
