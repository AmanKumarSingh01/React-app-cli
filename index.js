#!/usr/bin/env node
var path = require("path");
const exec = require("child_process").exec;
const fetch = require("node-fetch");
const { default: Axios } = require("axios");
var args = require("minimist")(process.argv.slice(2), {
  boolean: ["help", "check"],
  string: ["n", "path", "setup"],
});

const key = <Your_key />;

const BASEPATH = path.resolve(process.env.BASEPATH || __dirname);
if (args.help) {
  printHelp();
} else if (args.n) {
  if (args.path) {
    var pathto = path.join(BASEPATH, args.path);
    console.log("\x1b[32m", "work is in progress, please wait!");
    exec(
      `cd ${pathto} && mkdir ${args.n} && cd ${args.n} && create-react-app ./`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(`error: ${err.message}`);
          return;
        }

        if (stderr) {
          console.error(`stderr: ${stderr}`);
          //return;
        }

        console.log("\x1b[32m", "Creating github repo!");

        const payload = {
          name: `${args.n}`,
          description: "this is text",
          homepage: "https://github.com",
          private: false,
        };
        Axios.post("https://api.github.com/user/repos", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `token ${key}`,
          },
        })
          .then((res) => {
            console.log(res.data);
            exec(
              `cd ${pathto}/${args.n} && git init && git remote add origin ${res.data.ssh_url} && git add . && git branch -M master && git push -u origin master `,
              function (err, stdout, stderr) {
                if (err) {
                  console.error(`error: ${err.message}`);
                  return;
                }

                if (stderr) {
                  console.error(`stderr: ${stderr}`);
                }
                console.log("");
                console.log(`cd ${pathto}/${args.n}`);
                console.log("yarn start");
                console.log("Happy hacking");
              }
            );
          })
          .catch((e) => console.log("NetWork Error", e));
      }
    );
  } else {
    printHelp();
  }
} else {
  printHelp();
}
//************************************************
function printHelp() {
  console.log("github usage:");
  console.log("");
  console.log(
    "This package can be used while creating a react app and at the same time get synced with github"
  );
  console.log("");
  console.log("--help                             Gives you help window");
  console.log(
    "--n ={fineName} --path ={path}                    File name of the project"
  );
}
