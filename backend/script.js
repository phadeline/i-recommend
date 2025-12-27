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
import { exit } from "process";

//const frontendBuildPath = path.join(__dirname, "../frontend/public");

//app.use(express.static(frontendBuildPath));

const frontendBuildPath = path.join(__dirname, "..", "/frontend/build");
app.use("/i-recommend", express.static(frontendBuildPath));

const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const secretOrPrivateKey = process.env.MY_NEW_KEY;

//const secretOrPrivateKey = fs.readFileSync("./.env.keys", "utf8") ;


const payload = {
  iss: "P97D3C79H5",
  iat: utcNowSeconds,
  exp: utcNowSeconds + 60 * 60, // Token valid for 60 minutes
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

//app.options("/", (req, res) => {
 // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
 // res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
 // res.header("Access-Control-Allow-Headers", "Content-Type");
 // res.sendStatus(200);
//});

app.get("i-recommend/token", (req, res) => {
  console.log(token);
  res.status(200);
  res.header("Access-Control-Allow-Origin");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.send({ token: token });
});
