import fs from "fs";
import "dotenv/config";
import express from "express";
const app = express();
const port = process.env.PORT || 8000;
import jwt from "jsonwebtoken";

const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const secretOrPrivateKey = fs.readFileSync("../.env.keys", "utf8");

const payload = 
  {iss: "P97D3C79H5",
  iat: utcNowSeconds,
  exp: utcNowSeconds +(60*60*24)
  };

const myheader = {
  "alg": "ES256",
  "typ": "JWT", 
  "kid": "3VB3JF6C2K"
  }
  

//console.log(process.env.ISS)



const token =  jwt.sign(
  JSON.stringify(payload),
  secretOrPrivateKey,  {algorithm: "ES256", header: myheader}, 
 //JSON.stringify({header: header})
)
console.log(token)
app.listen(port, () => {
  console.log(`listening app http://localhost:${port}`);
});

app.get("/", (req, res) => {
  console.log(token)
      res
        .status(200)
        .header("Access-Control-Allow-Origin", "http://127.0.0.1:5500") 
        .send({ token: token });
     
    });