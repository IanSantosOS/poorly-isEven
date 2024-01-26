const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');

let maxNum = (() => {
  if (fs.existsSync('./files/isEvenSwitch.js')) {
    const file = fs.readFileSync('./files/isEvenSwitch.js', 'utf-8').split('case ');
    const number = file.at(-1).split(':')[0];
    return Number(number);
  }
  else {
    return 0;
  }
})();

const generateFile = (number) => {
  let code = "";

  for (let i = maxNum; i <= number; i++) {
    if (i !== 0 && i === maxNum) continue;

    if (i === 0) {
      code += '\n\nswitch (number) {';
    }
    code += `\n  case ${i}: console.log(${i % 2 === 0 ? '"Is Even"' : '"Is Odd"'}); break;`;
  }
  code += '\n}';

  if (fs.existsSync('./files/isEvenSwitch.js')) {
    const file = fs.readFileSync('./files/isEvenSwitch.js', 'utf-8').replace('\n}', '').split('\n');
    file[0] = `const number = ${number}`;
    fs.writeFileSync('./files/isEvenSwitch.js', file.join('\n') + code);
  }
  else {
    fs.writeFileSync('./files/isEvenSwitch.js', `const number = ${number}`);
    fs.appendFileSync('./files/isEvenSwitch.js', code);
  }
};

const execIsEven = () => exec('node ./files/isEvenSwitch.js', (error, stdout, stderror) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  if (stderror) {
    console.error('StdError:', stderror);
    return;
  }
  console.log(stdout);
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Write a Number: ', async (inp) => {
  const num = Number(inp);

  if (inp.trim() === '' || Number.isNaN(num)) {
    console.error('\x1b[31mThis is not a Number...\x1b[0m\n');
    return rl.close();
  }
  else if (num < 0) {
    console.error('\x1b[31mOnly positive Numbers!\x1b[0m\n');
    return rl.close();
  }

  if (num > maxNum) {
    generateFile(num);
  }
  execIsEven();
  rl.close();
});