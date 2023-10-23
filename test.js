const crypto = require('crypto');
require('dotenv').config();


const encryptionKey = process.env.ENCRYPTION_SECRET_KEY; // Replace with your actual key
const iv = process.env.INITIAL_IV;
const plainText = 'Hello, World!';

const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);

let encryptedData = cipher.update(plainText, 'utf8', 'hex');
encryptedData += cipher.final('hex');

console.log('Encrypted Data:', encryptedData);
console.log(plainText)

const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);

let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
decryptedData += decipher.final('utf8');

console.log('Decrypted Data:', decryptedData);
