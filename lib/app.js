#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const packageList = require('./list');

const select = (name) => {
  inquirer.prompt([{
    type: 'list',
    name: 'menu',
    message: chalk.magenta('프로젝트를 선택해주세요.'),
    choices: packageList.map(item => item.name),
  }])
  .then((answers) => {
    maker(name, packageList.find(item => item.name === answers.menu));
  })
}

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');
const maker = (name, type) => {
  const projectPath = path.join(process.cwd(), name);
  fs.mkdir(path.join(process.cwd(), name), (err) => { 
    if (err) return console.log(err);
    fs.copy(path.join(packagesDir, type.project), projectPath, err => {
      if (err) return console.error(err)
      console.log('Success!' + chalk.bold(` Created ${chalk.green(type.name)} at ${chalk.cyan(projectPath)}\n`));
      console.log('  To get started:\n')
      console.log(chalk.bold.cyan('    cd ' + name));
      console.log(chalk.bold.cyan('    npm i\n'));
      console.log('  You can run several commands:\n')
      console.log(chalk.bold.cyan('    npm run dev'));
      console.log(chalk.bold.cyan('    npm run build'));
      console.log(chalk.bold.cyan('    npm run lintfix\n'));
    })
  });
}

program
  .version('0.0.1', '-v -version')
  .arguments('<projectName>')
  .action((projectName) => {
    select(projectName);
  });
program.parse(process.argv);