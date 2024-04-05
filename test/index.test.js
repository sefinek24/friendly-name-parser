const username = require('../src/index.js');

describe('Validator Tests', () => {
	describe('#isHTML', () => {
		test('Detects simple <h1> tag', () => {
			const { isHTML } = username('<h1>Hello world!</h1>');
			expect(isHTML).toBe(true);
		});

		test('Detects simple <code> tag', () => {
			const { isHTML } = username('<code>Hello</code>');
			expect(isHTML).toBe(true);
		});

		test('Detects <script> tag with JavaScript code', () => {
			const { isHTML } = username('<script>let say = "meow!";</script>');
			expect(isHTML).toBe(true);
		});
	});

	describe('#isJS', () => {
		test('Identifies HTTP server code snippet', () => {
			const { isJS } = username('// server.mjs\n' +
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
			const { isJS } = username('const express = require(\'express\')\n' +
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
			const { isPHP } = username('<?php echo "I really hate PHP"; ?>');
			expect(isPHP).toBe(true);
		});
	});

	describe('#breakSpaces', () => {
		test('Detects break spaces', () => {
			const { breakSpaces } = username('Hello w orld!');
			expect(breakSpaces).toBe(true);
		});
	});
});

describe('Pretty usernames', () => {
	test('Removes <h1> tag', () => {
		const { pretty } = username('<h1>Hello world!</h1>');
		expect(pretty).toBe('Hello World');
	});

	test('Removes <code> tag', () => {
		const { pretty } = username('<code>const cat = "Keyboard cat";</code>');
		expect(pretty).toBe('Cat Keyboard Cat');
	});

	test('Removes <script> tag', () => {
		const { pretty } = username('<script>alert("Neko~chan")</script>');
		expect(pretty).toBe('Neko~chan');
	});

	test('Extracts username from email address', () => {
		const { pretty } = username('vfdg fdsa dfsa <?>#0@$%<?ó@>#$<%@ł#$ż?>%ń<@#?> $SefInek.@gmail.com j asdfasd afsdf asd fasdj');
		expect(pretty).toBe('Sefinek');
	});

	test('Removes URLs', () => {
		const { pretty } = username('Sefinek (https://sefinek.net)');
		expect(pretty).toBe('Sefinek');
	});

	test('Removes multiple URLs', () => {
		const { pretty } = username('/.  https://d  kEYboard cat https://github.com/sefinek24?tab=repositories ./ ');
		expect(pretty).toBe('Keyboard Cat');
	});

	test('Correctly converts Polish names', () => {
		const { pretty } = username('GRzegorz Brzęczyszczykiewicz');
		expect(pretty).toBe('Grzegorz Brzęczyszczykiewicz');
	});

	test('Correctly trims text', () => {
		const { pretty } = username('			I love 	cats ');
		expect(pretty).toBe('I Love Cats');
	});

	test('Removes emojis', () => {
		const { pretty } = username('Meow! 🐱🐱🐱');
		expect(pretty).toBe('Meow');
	});

	test('Removes multiple emojis', () => {
		const { pretty } = username('!!😸S😸e😸f😸i😸!!');
		expect(pretty).toBe('Sefi');
	});

	test('Handles sentences with emojis correctly', () => {
		const { pretty } = username('Quick fox🦊 jumps over^ the lazy <- dog🐶.');
		expect(pretty).toBe('Quick Fox Jumps Over the Lazy Dog');
	});

	test('Correctly removes characters from both sides', () => {
		const { pretty } = username('.-^Just a cat^-.');
		expect(pretty).toBe('Just a Cat');
	});

	test('Handles long strings with links and emojis', () => {
		const { pretty } = username('🦀🦐🦪🐚 !!!!!!!!!!!!!I AM  JUST A FISH!!!!!!!!!!!! 😭🐟🐠🦈🐡🐬🐳🐋🦭🐙🦑🦞https://www.youtube.com/watch?v=1goAp0XmhZQ🐌🦋🐛🐜🐝🐞🦗🦂🦟🦠🐢🐍🦎🦖🦕🐙🦑https://www.youtube.com/watch?v=1goAp0XmhZQ    ');
		expect(pretty).toBe('I Am Just a Fish');
	});

	test('Removes non-breaking spaces correctly', () => {
		const { pretty } = username('S e F i N e K');
		expect(pretty).toBe('Sefinek');
	});

	describe('Additional tests', () => {
		test('Identifies and removes markdown links', () => {
			const { pretty } = username('Check out my [blog](https://myblog.com)!');
			expect(pretty).toBe('Check Out My Blog');
		});

		test('Correctly processes nested HTML tags', () => {
			const { pretty } = username('<div><span>Nested <b>HTML</b> content</span></div>');
			expect(pretty).toBe('Nested HTML Content');
		});

		test('Handles string with special characters', () => {
			const { pretty } = username('Special &characters* should# be$ cleaned@ up%!');
			expect(pretty).toBe('Special Characters Should Be Cleaned Up');
		});

		test('Correctly capitalizes mixed case strings', () => {
			const { pretty } = username('mIxEd CaSe StRiNgS should be normalized');
			expect(pretty).toBe('Mixed Case Strings Should Be Normalized');
		});
	});
});
