import fs from "fs";
import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch"
const app = express();


import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port =  process.env.PORT; 
import jwt from "jsonwebtoken";


const API_URL = process.env.REACT_URL;


const frontendBuildPath = process.env.NODE_ENV === 'production' ? path.join(__dirname, "../frontend/build") : path.join(__dirname, "../frontend/public"); 

app.use(express.static(frontendBuildPath));

const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const secretOrPrivateKey = process.env.NODE_ENV === 'production' ? process.env.MY_NEW_KEY : fs.readFileSync("../.env.keys", "utf8") ;



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


function myFunction(){
const token = jwt.sign(
  JSON.stringify(payload),
  secretOrPrivateKey,
  { header: myheader }
  //JSON.stringify({header: header})
)
console.log("token: " + token);
return token;
};

app.use(cors({
  origin: API_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "Content-Type", "X-Auth-Token", "Authorization", "Music-User-Token"]
}));

// explicitly handle preflight
app.options(/.*/, cors());


app.get("/", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
  console.log("status: " + res.statusCode)
});



app.get("/token", (req, res) => {
 
 const token = myFunction();
  res.status(200).send(token);
});


app.get("/api/:songId", async (req, res) => {
  
  try {
    const songId = req.params.songId;

    const response = await fetch(
      `https://api.music.apple.com/v1/catalog/us/songs/${songId}`, 
      {
        headers: {
          Authorization: req.headers.authorization,
          "Music-User-Token": req.headers["music-user-token"],
          "Content-Type": "application/json",
          
        }
      }
    );
const text = await response.text();
   // console.log("Status:", response.status);
    console.log("Raw response:", text);
  
    const data = JSON.parse(text);

    if (!response.ok) {
      return res.json(data);
    }

    res.json(data);

  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: error.message });
  }
});


app.get("/api/getAllTracks/:finalglobalID", async (req, res) => {
  try {
    const finalglobalID = req.params.finalglobalID;

    const response = await fetch(
      `https://api.music.apple.com/v1/catalog/us/playlists/${finalglobalID}/tracks`,
{
        headers: {
          Authorization: req.headers.authorization,
         "music-user-token": req.headers["music-user-token"],
          "Content-Type": "application/json",
          
        }
      }
    );

const text = await response.text();
//console.log("Raw response:", text);

const data = JSON.parse(text);

    if (!response.ok) {
      return res.json(data);
    }

    res.json(data);

  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: error.message });
  }
});




    //"http://localhost:9000/token", "http://localhost:3000"

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);

});


