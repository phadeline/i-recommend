import fs from 'fs';
import 'dotenv'


const utcNowMilliseconds = Date.now(); // Get current UTC time in milliseconds
const utcNowSeconds = Math.floor(utcNowMilliseconds / 1000); // UTC time in seconds

const secretOrPrivateKey = fs.readFileSync("../.env", 'utf8');


const payload = {
    iss: "P97D3C79H5",
    iat: utcNowSeconds,
    exp: 7200
}
import jwt from 'jsonwebtoken';
const token = jwt.sign(payload, secretOrPrivateKey, {algorithm: 'ES256', keyid: "6837BD67PF"} ,(err, token) =>
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

export default token;

