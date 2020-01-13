const octonode = require("octonode")
const inquirer = require("inquirer")
const html = require("./html.js");
const fs = require("fs")
const electron = require("electron-html-to");
const convertFactory = require('electron-html-to');
const conversion = convertFactory({
  converterPath: convertFactory.converters.PDF,
  allowLocalFilesAccess: true
});
let info = {}
const colors = {
  green: {
    wrapperBackground: "#E6E1C3",
    headerBackground: "#C1C72C",
    headerColor: "black",
    photoBorderColor: "#black"
  },
  blue: {
    wrapperBackground: "#5F64D3",
    headerBackground: "#26175A",
    headerColor: "white",
    photoBorderColor: "#73448C"
  },
  pink: {
    wrapperBackground: "#879CDF",
    headerBackground: "#FF8374",
    headerColor: "white",
    photoBorderColor: "#FEE24C"
  },
  red: {
    wrapperBackground: "#DE9967",
    headerBackground: "#870603",
    headerColor: "white",
    photoBorderColor: "white"
  }
};
inquirer.prompt([
  {
    type: "input",
    name: "user",
    message: "What is your github usernamename?"
  }, {
    type: "list",
    choices: ["green", "blue", "pink", "red"],
    name: "color",
    message: "What is your github usernamename?"
  }
]).then(function (data) {
  let user = data.user;
  let color = data.color;
  info.color = colors[color]

  const client = octonode.client();
  client.get(`/users/${user}`, {}, function (err, status, body, headers) {
    info.picture = body.avatar_url
    info.name = body.name;
    info.company = body.company;
    info.location = body.location;
    info.profile = body.location;
    info.profile = body.html_url;
    info.blog = body.blog;
    info.bio = body.bio;
    info.public = body.public_repos;
    info.followers = body.followers;
    info.following = body.following;
    // console.log(body)
    client.get(`/users/${user}/starred`, {}, function (err, status, body, headers) {
      info.stars = body.length;
      console.log(info)

      conversion({ html: html.html(info) }, function(err, result) {
        if (err) {
          return console.error(err);
        };
        result.stream.pipe(fs.createWriteStream(`./${info.name}.pdf`));
        conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
      });
      // fs.writeFile("index.html", html.html(info), (err) => {
      //   if (err) throw err;
      //   console.log('The file has been saved!');
      // });
    });
  });
});


