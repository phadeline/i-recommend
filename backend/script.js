import fs from "fs";
import "dotenv/config";
import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8000;
import jwt from "jsonwebtoken";

app.use(express.static(path.join(__dirname, '../public')));

const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const secretOrPrivateKey = fs.readFileSync("../.env.keys", "utf8");

const payload = 
  {iss: process.env.ISS,
  iat: utcNowSeconds,
  exp: utcNowSeconds +(60*60) // Token valid for 60 minutes
  };

const myheader = {
  "alg": "ES256",
  "typ": "JWT", 
  "kid": process.env.KID
  }
  

//console.log(process.env.ISS)



const token =  jwt.sign(
  JSON.stringify(payload),
  secretOrPrivateKey,  {header: myheader}, 
 //JSON.stringify({header: header})
)
console.log(token)
app.listen(port, () => {
  console.log(`listening app http://localhost:${port}`);
});

app.get("/" , (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html",)); ;  
});

app.options("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

app.get("/token", (req, res) => {
  console.log(token)
      res
        .status(200)
        //.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500") 
        .send({ token: token });
     
    });