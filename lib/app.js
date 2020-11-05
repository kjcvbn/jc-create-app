#!/usr/bin/env node

const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const packageList = [
  {
    name: 'ES6 (spa)',
    project: 'es6_spa'
  },
  {
    name: 'ES6 (mpa)',
    project: 'es6_spa'
  },
  {
    name: 'typescript',
    project: 'typescript'
  },
  {
    name: 'VUE',
    project: 'vue'
  },
  {
    name: 'NUXT',
    project: 'nuxt'
  }
]



const select = (name) => {
  inquirer.prompt([{
    type: 'list',
    name: 'menu',
    // message: chalk.magenta('프로젝트를 선택해주세요.'),
    choices: packageList.map(item => item.name),
  }])
  .then((answers) => {
    maker(name, packageList.find(item => item.name === answers.menu).project);
  })
}

const rootDir = path.join(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

// console.log('rootDir : ' + rootDir);

// console.log('process : ' + process.cwd())



const maker = (name, type) => {
  const projectPath = path.join(process.cwd(), name);
  console.log(chalk.bold(` * Creating ${chalk.green(type)} project in ${chalk.cyan(projectPath)}`));
  fs.mkdir(path.join(process.cwd(), name), (err) => { 
    if (err) return console.log(err);
    fs.copy(path.join(packagesDir, type), projectPath, err => {
      if (err) return console.error(err)
      console.log('success!')
    })
  });
}



program
  .version('0.0.1', '-v -version')
  .arguments('<projectName>')
  .action((projectName) => {
    // 프로젝트 이름 유효성 체크 필요

    select(projectName);
  });

program.parse(process.argv);


