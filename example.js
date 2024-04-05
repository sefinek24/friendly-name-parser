const usernameValidator = require('./src/index.js');

const input1 = '<code>const username="hello";\\<code>';
console.log(usernameValidator(input1));

const input2 = '/\\/.  https://d  kEYboard cat https://github.com/sefinek24?tab=repositories \n\'\'   ';
console.log(usernameValidator(input2));

const input3 = 'Quick fox🦊 jumps over^ the lazy <- dog🐶..';
console.log(usernameValidator(input3));

const input4 = 'I am just a https://www.youtube.com/watch?v=keqhcFqp2pI fish in the sea 🐟🐠🐟🦈🐟🐡🐟🐠. DON\'T KILL ME, HELP ME SWIM AWAY';
console.log(usernameValidator(input4));

const input5 = 'vfdg fdsa dfsa <?>#0@$%<?ó@>#$<%@ł#$ż?>%ń<@#?> $SefInek.@gmail.com j asdfasd afsdf asd fasdj';
console.log(usernameValidator(input5));

const input6 = '    🦀🦐🦪🐚 !!!!!!!!!!!!!I AM  JUST A FISH!!!!!!!!!!!! 😭🐟🐠🦈🐡🐬🐳🐋🦭🐙🦑🦞https://www.youtube.com/watch?v=1goAp0XmhZQ🐌🦋🐛🐜🐝🐞🦗🦂🦟🦠🐢🐍🦎🦖🦕🐙🦑https://www.youtube.com/watch?v=1goAp0XmhZQ    ';
console.log(usernameValidator(input6));

const input7 = 'GRzegorz BRZĘCZYSZCZYKIEWICZ!';
console.log(usernameValidator(input7));

const input8 = 'Siała baba mak';
console.log(usernameValidator(input8));

const input9 = 'UwU oniichan OwO senpai';
console.log(usernameValidator(input9));

const input10 = 'Fuck all faggots 🔥';
console.log(usernameValidator(input10));