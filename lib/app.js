#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const packageList = require('./list');

const log = (color) => (msg, space = 0) => {
  const s = !space ? '' : (() => new Array(space).fill(' ').reduce((a, c) => a + c))();
  if(typeof msg === 'string') console.log(chalk[color](s + msg));
  else msg.forEach(m => console.log(chalk[color](s + m)));
};

const select = (name) => {
  inquirer.prompt([{
    type: 'list',
    name: 'menu',
    message: chalk.magenta('프로젝트를 선택해주세요.'),
    choices: packageList.map(item => item.name),
  }])
  .then((answers) => {
    maker(name, packageList.find(item => item.name === answers.menu));
  });
};

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');
const maker = (name, type) => {
  const projectPath = path.join(process.cwd(), name);
  fs.mkdir(path.join(process.cwd(), name), (err) => { 
    if (!!err) return console.log(err);
    fs.copy(path.join(packagesDir, type.project), projectPath, err => {
      if (!!err) return console.error(err);
      const cyan = log('cyan');
      console.log(`Success! Created ${chalk.green(type.name)} at ${chalk.green(projectPath)}\n\n  To get started:\n`);
      cyan([`cd ${name}`, 'npm i\n'], 4);
      if(!!type.commands) {
        console.log('  You can run several commands:\n');
        cyan(type.commands, 4);
        console.log('\n');
      };
    });
  });
};

program
  .version('0.0.1', '-v -version')
  .arguments('<projectName>')
  .action((projectName) => {
    select(projectName);
  });
program.parse(process.argv);