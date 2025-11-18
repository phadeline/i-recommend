
import jwt from 'jsonwebtoken';
import 'dotenv/config';

var button;

const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds




const secretOrPrivateKey = process.env.PRIVATE_KEY;

const payload = {
    iss: process.env.I_S_S,
    iat: utcNowSeconds,
    exp: 60
}


const token = jwt.sign(payload, secretOrPrivateKey, {algorithm: 'ES256', keyid: process.env.KID },(err, token) =>
{
  if (err) {
    // Handle error during token signing
    console.error('Error signing JWT:', err);
    return;
  }
  // Token successfully signed, 'token' contains the generated JWT
  console.log('Generated JWT:', token);

  // You can now send this token to the client or use it as needed

});

$(function(){button = document.getElementById("myRange")});
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




