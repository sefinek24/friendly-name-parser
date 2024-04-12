const prettyUsername = require('../src/index.js');

describe('Validator Tests', () => {
	describe('#isHTML', () => {
		test('Detects simple <h1> tag', () => {
			const { isHTML } = prettyUsername('<h1>Hello world!</h1>');
			expect(isHTML).toBe(true);
		});

		test('Detects simple <code> tag', () => {
			const { isHTML } = prettyUsername('<code>Hello</code>');
			expect(isHTML).toBe(true);
		});

		test('Detects <script> tag with JavaScript code', () => {
			const { isHTML } = prettyUsername('<script>let say = "meow!";</script>');
			expect(isHTML).toBe(true);
		});
	});

	describe('#isJS', () => {
		test('Identifies HTTP server code snippet', () => {
			const { isJS } = prettyUsername('// server.mjs\n' +
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
			const { isJS } = prettyUsername('const express = require(\'express\')\n' +
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
			const { isPHP } = prettyUsername('<?php echo "I really hate PHP"; ?>');
			expect(isPHP).toBe(true);
		});
	});

	describe('#breakSpaces', () => {
		test('Detects break spaces', () => {
			const { breakSpaces } = prettyUsername('Hello w orld!');
			expect(breakSpaces).toBe(true);
		});
	});
});

describe('Pretty prettyUsernames', () => {
	test('Removes <h1> tag', () => {
		const { pretty } = prettyUsername('<h1>Hello world!</h1>');
		expect(pretty).toBe('Hello World');
	});

	test('Removes <code> tag', () => {
		const { pretty } = prettyUsername('<code>const cat = "Keyboard cat";</code>');
		expect(pretty).toBe('Cat Keyboard Cat');
	});

	test('Removes <script> tag', () => {
		const { pretty } = prettyUsername('<script>alert("Neko~chan")</script>');
		expect(pretty).toBe('Neko~chan');
	});

	test('Extracts prettyUsername from email address', () => {
		const { pretty } = prettyUsername('vfdg fdsa dfsa <?>#0@$%<?ó@>#$<%@ł#$ż?>%ń<@#?> $SefInek.@gmail.com j asdfasd afsdf asd fasdj');
		expect(pretty).toBe('Sefinek');
	});

	test('Removes URLs', () => {
		const { pretty } = prettyUsername('Sefinek (https://sefinek.net)');
		expect(pretty).toBe('Sefinek');
	});

	test('Removes multiple URLs', () => {
		const { pretty } = prettyUsername('/.  https://d  kEYboard cat https://github.com/sefinek24?tab=repositories ./ ');
		expect(pretty).toBe('Keyboard Cat');
	});

	test('Correctly converts Polish names', () => {
		const { pretty } = prettyUsername('GRzegorz Brzęczyszczykiewicz');
		expect(pretty).toBe('Grzegorz Brzęczyszczykiewicz');
	});

	test('Correctly trims text', () => {
		const { pretty } = prettyUsername('			I love 	cats ');
		expect(pretty).toBe('I Love Cats');
	});

	test('Removes emojis', () => {
		const { pretty } = prettyUsername('Meow! 🐱🐱🐱');
		expect(pretty).toBe('Meow');
	});

	test('Removes multiple emojis', () => {
		const { pretty } = prettyUsername('!!😸S😸e😸f😸i😸!!');
		expect(pretty).toBe('Sefi');
	});

	test('Handles sentences with emojis correctly', () => {
		const { pretty } = prettyUsername('Quick fox🦊 jumps over^ the lazy <- dog🐶.');
		expect(pretty).toBe('Quick Fox Jumps Over the Lazy Dog');
	});

	test('Correctly removes characters from both sides', () => {
		const { pretty } = prettyUsername('.-^Just a cat^-.');
		expect(pretty).toBe('Just a Cat');
	});

	test('Handles long strings with links and emojis', () => {
		const { pretty } = prettyUsername('🦀🦐🦪🐚 !!!!!!!!!!!!!I AM  JUST A FISH!!!!!!!!!!!! 😭🐟🐠🦈🐡🐬🐳🐋🦭🐙🦑🦞https://www.youtube.com/watch?v=1goAp0XmhZQ🐌🦋🐛🐜🐝🐞🦗🦂🦟🦠🐢🐍🦎🦖🦕🐙🦑https://www.youtube.com/watch?v=1goAp0XmhZQ    ');
		expect(pretty).toBe('I Am Just a Fish');
	});

	test('Removes non-breaking spaces correctly', () => {
		const { pretty } = prettyUsername('S e F i N e K');
		expect(pretty).toBe('Sefinek');
	});

	describe('Additional tests', () => {
		test('Identifies and removes markdown links', () => {
			const { pretty } = prettyUsername('Check out my [blog](https://myblog.com)!');
			expect(pretty).toBe('Check Out My Blog');
		});

		test('Correctly processes nested HTML tags', () => {
			const { pretty } = prettyUsername('<div><span>Nested <b>HTML</b> content</span></div>');
			expect(pretty).toBe('Nested HTML Content');
		});

		test('Handles string with special characters', () => {
			const { pretty } = prettyUsername('Special &characters* should# be$ cleaned@ up%!');
			expect(pretty).toBe('Special Characters Should Be Cleaned Up');
		});

		test('Correctly capitalizes mixed case strings', () => {
			const { pretty } = prettyUsername('mIxEd CaSe StRiNgS should be normalized');
			expect(pretty).toBe('Mixed Case Strings Should Be Normalized');
		});
	});
});
