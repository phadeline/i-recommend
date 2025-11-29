import fs from 'fs';
import 'dotenv/config'
import express from 'express';
const app = express();
const port = process.env.PORT || 8000;


const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const secretOrPrivateKey = fs.readFileSync("../.env.keys", 'utf8');

const payload = {
    iss: fs.readFileSync.toString("../.env.ISS"),
    iat: utcNowSeconds,
    exp: 7200
}
import jwt from 'jsonwebtoken';

const token = jwt.sign(payload, secretOrPrivateKey, {algorithm: 'ES256', keyid: fs.readFileSync.toString(("../.env.KID"))} ,(err, token) =>
{
  if (err) {
    // Handle error during token signing
    console.error('Error signing JWT:', err);
    return;
  }
  // Token successfully signed, 'token' contains the generated JWT
  console.log('Generated JWT:', token);
  app.get('/', (req, res)=>{
  res.status(200).header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  .send({token: `${token}`});
})


  // You can now send this token to the client or use it as needed

});




app.listen(port, ()=>{
console.log(`listening app http://localhost:${port}`)
})


