#!/usr/bin/env node

const { program } = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs-extra");
const path = require("path");
const packageList = require("./list");
const unzipper = require("unzipper");
const request = require("request");
const ProgressBar = require("progress");

const makeUniqueTmepPath = () => {
  const tempDirPath = path.join(
    process.cwd(),
    "temp_" +
      Date.now().toString() +
      "_" +
      Math.random().toString().substring(2)
  );
  return fs.existsSync(tempDirPath) ? makeUniqueTmepPath() : tempDirPath;
};

const downloadFile = async (url, folderName) => {
  const zipName = "__template.zip";
  const tempDirPath = makeUniqueTmepPath();
  const zipPath = path.join(tempDirPath, zipName);
  const removeTempFolder = () => fs.remove(tempDirPath);

  var bar = new ProgressBar(" downloading [:bar] :rate/bps :percent :etas", {
    complete: "=",
    incomplete: " ",
    width: 30,
    total: 5,
    clear: true,
  });
  fs.mkdir(tempDirPath, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    bar.tick();
    const fileStream = fs.createWriteStream(zipPath);
    const zipFile = request(url).pipe(fileStream);
    zipFile.on("finish", () => {
      bar.tick();
      const unzipFile = fs
        .createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: tempDirPath }));
      unzipFile.on("finish", async () => {
        bar.tick();
        await fs.unlink(zipPath);
        const targetFolderData = await fs.readdir(tempDirPath);
        const targetFolderName = targetFolderData[0];
        const outPath = path.join(process.cwd(), folderName);
        bar.tick();
        fs.copy(
          path.join(tempDirPath, targetFolderName),
          path.join(outPath),
          (err) => {
            if (err) {
              console.error(err);
            }
            bar.tick();
            removeTempFolder();
            console.log("\n");
            console.log(chalk.green("  프로젝트 복사 완료: " + outPath));
            console.log("\n");
          }
        );
      });
      unzipFile.on("error", (err) => {
        console.error(err);
        removeTempFolder();
      });
    });
    zipFile.on("error", (err) => {
      console.error(err);
      removeTempFolder();
    });
  });
};
const log =
  (color) =>
  (msg, space = 0) => {
    const s = !space
      ? ""
      : (() => new Array(space).fill(" ").reduce((a, c) => a + c))();
    if (typeof msg === "string") console.log(chalk[color](s + msg));
    else msg.forEach((m) => console.log(chalk[color](s + m)));
  };

const select = (name) => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "menu",
        message: chalk.magenta("프로젝트를 선택해주세요."),
        choices: packageList.map((item) => item.name),
      },
    ])
    .then((answers) => {
      maker(
        name,
        packageList.find((item) => item.name === answers.menu)
      );
    });
};
const checkPossibleFolder = (name) => {
  const targetPath = path.join(process.cwd(), name);
  if (fs.existsSync(targetPath)) {
    inquirer
      .prompt([
        {
          type: "confirm",
          name: "flag",
          message: chalk.magenta(
            "이미 존재하는 프로젝트입니다. 계속 진행하시겠습니까?"
          ),
        },
      ])
      .then((answers) => {
        if (answers.flag) {
          select(name);
        }
      });
  } else {
    select(name);
  }
};

const maker = (name, type) => {
  const { fileUrl } = type;
  downloadFile(fileUrl, name);
};

program
  .version("0.0.1", "-v -version")
  .arguments("<projectName>")
  .action((projectName) => {
    checkPossibleFolder(projectName);
  });
program.parse(process.argv);
