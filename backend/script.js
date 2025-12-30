import fs from "fs";
import "dotenv/config";
import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 8000;
import jwt from "jsonwebtoken";


//const frontendBuildPath = path.join(__dirname, "../frontend/public");

//app.use(express.static(frontendBuildPath));

const API_URL = process.env.NODE_ENV === 'production' ? process.env.REACT_URL: 'http://localhost:3000';



const frontendBuildPath = path.join(__dirname, "..", "/frontend/build");
app.use("/", express.static(frontendBuildPath));

const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const secretOrPrivateKey = process.env.MY_NEW_KEY;

//const secretOrPrivateKey = fs.readFileSync("./.env.keys", "utf8") ;

const payload = {
  iss: "P97D3C79H5",
  iat: utcNowSeconds,
  exp: utcNowSeconds + (60*60*24), // Token valid for 24 hours 
};

const myheader = {
  alg: "ES256",
  typ: "JWT",
  kid: "Y2JCYYP2DS",
};

//console.log(process.env.ISS)

const token = jwt.sign(
  JSON.stringify(payload),
  secretOrPrivateKey,
  { header: myheader }
  //JSON.stringify({header: header})
);
console.log(token);
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});



app.get("https://i-recommend-289e22b5c5f5.herokuapp.com/token", (req, res) => {
  console.log(token);
  res.status(200);
  res.header("Access-Control-Allow-Origin", "https://i-recommend-289e22b5c5f5.herokuapp.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.send({ token: token });
});
