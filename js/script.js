var button;

$(document).ready(function(){button = document.getElementById("myRange")});

const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const jwt = require("jsonwebtoken");
const fs = require("fs");
const privatekey = fs.readFileSync('private_key.pem');
const payload = {
    iss: import.meta.env.ISS,
    iat: utcNowSeconds,
    exp: 86400
}


const token = jwt.sign(payload, privatekey,{algorithm: 'ES256', kid: import.meta.env.KID })

button.addEventListener("change", async function () {
    // Call configure() to configure an instance of MusicKit on the Web.
    console.log("2");
      try {
        await MusicKit.configure({
          developerToken: token,
          app: {
            name: "applemusic",
            build: "25.11.1",
          },
        });
        console.log("success");
      } catch (err) {
        console.log("err");
        // Handle configuration error
      }
   

    // MusicKit instance is available
    const music = MusicKit.getInstance();

   
  });




