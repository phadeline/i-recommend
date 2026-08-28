import fs from "fs";
import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
const app = express();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT;
import jwt from "jsonwebtoken";

const API_URL = process.env.REACT_URL;

const frontendBuildPath =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "../frontend/build")
    : path.join(__dirname, "../frontend/public");

app.use(express.static(frontendBuildPath));
app.use(express.json());

const secretOrPrivateKey =
  process.env.NODE_ENV === "production"
    ? process.env.MY_NEW_KEY
    : fs.readFileSync("../.env.keys", "utf8");

const myheader = {
  alg: "ES256",
  typ: "JWT",
  kid: "5NB5VSBKC2",
};

function myFunction() {
  const utcNowSeconds = Math.floor(Date.now() / 1000); // UTC time in seconds

  const payload = {
    iss: "P97D3C79H5",
    iat: utcNowSeconds,
    exp: utcNowSeconds + 60 * 60 * 24, // Token valid for 24 hours
  };

  const token = jwt.sign(
    JSON.stringify(payload),
    secretOrPrivateKey,
    { header: myheader },
    //JSON.stringify({header: header})
  );
  console.log("token: " + token);
  return token;
}

app.use(
  cors({
    origin: API_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "Content-Type",
      "X-Auth-Token",
      "Authorization",
      "Music-User-Token",
    ],
  }),
);

// explicitly handle preflight
app.options(/.*/, cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
  console.log("status: " + res.statusCode);
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
        },
      },
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
        },
      },
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

app.get("/api/library/playlists", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.music.apple.com/v1/me/library/playlists",
      {
        headers: {
          Authorization: req.headers.authorization,
          "Music-User-Token": req.headers["music-user-token"],
          "Content-Type": "application/json",
        },
      },
    );

    const text = await response.text();
    const data = JSON.parse(text);
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/library/playlists/:playlistId/tracks", async (req, res) => {
  try {
    const { playlistId } = req.params;

    const response = await fetch(
      `https://api.music.apple.com/v1/me/library/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: req.headers.authorization,
          "Music-User-Token": req.headers["music-user-token"],
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    if (response.status === 204) {
      return res.status(204).end();
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/search/songs", async (req, res) => {
  try {
    const term = req.query.term;

    const response = await fetch(
      `https://api.music.apple.com/v1/catalog/us/search?types=songs&limit=25&term=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: req.headers.authorization,
          "Content-Type": "application/json",
        },
      },
    );

    const text = await response.text();
    const data = JSON.parse(text);
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Server Crash:", error);
    res.status(500).json({ error: error.message });
  }
});

//"http://localhost:9000/token", "http://localhost:3000"

app.get("/privacy", (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy – iRecomend</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 720px; margin: 60px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.7; }
    h1 { font-size: 2rem; margin-bottom: 4px; }
    .date { color: #666; font-size: 0.9rem; margin-bottom: 40px; }
    h2 { font-size: 1.1rem; margin-top: 36px; }
    a { color: #0071e3; }
  </style>
</head>
<body>
  <h1>Privacy Policy</h1>
  <p class="date">Last updated: August 15, 2026</p>

  <h2>Overview</h2>
  <p>iRecomend is a music recommendation app that connects to your Apple Music library to suggest new tracks based on your playlists. Your privacy is important to us. This policy explains what data the app accesses and how it is used.</p>

  <h2>Data We Access</h2>
  <p>iRecomend requests access to your Apple Music library solely to read your playlists and the tracks within them. This information is used on-device to generate music recommendations. It is never sent to our servers or any third party.</p>

  <h2>Data We Do Not Collect</h2>
  <p>We do not collect, store, or transmit any personal information. We do not use analytics, advertising SDKs, or tracking tools of any kind.</p>

  <h2>Third-Party Services</h2>
  <p>iRecomend communicates exclusively with Apple's MusicKit and Apple Music APIs to fetch music catalog data and play audio previews. This communication is governed by <a href="https://www.apple.com/legal/privacy/">Apple's Privacy Policy</a>.</p>

  <h2>Audio Previews</h2>
  <p>Track previews are streamed directly from Apple's servers. No audio data is recorded or stored by the app.</p>

  <h2>Children's Privacy</h2>
  <p>iRecomend does not knowingly collect information from children under 13.</p>

  <h2>Changes to This Policy</h2>
  <p>We may update this policy from time to time. Continued use of the app after changes constitutes acceptance of the updated policy.</p>

  <h2>Contact</h2>
  <p>If you have questions about this privacy policy, please visit our support page at <a href="https://i-recommend-289e22b5c5f5.herokuapp.com/">i-recommend-289e22b5c5f5.herokuapp.com</a>.</p>

  <p style="margin-top:60px; color:#999; font-size:0.85rem;">© 2026 Phadeline Evra. All rights reserved.</p>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
