const crypto = require('crypto'); 

const generateTOTP = (secret, timeStep = 30, digits = 6) => {
  // Get the current time in seconds
  const currentTime = Math.floor(Date.now() / 1000);

  // Calculate the time counter
  const timeCounter = Math.floor(currentTime / timeStep);

  // Convert the secret to a binary key
  const secretKey = btoa(secret);

  // Create a buffer with the time counter as an 8-byte integer (big-endian)
  const timeBuffer = new ArrayBuffer(8);
  const view = new DataView(timeBuffer);
  view.setUint32(4, timeCounter >> 24);
  view.setUint32(0, timeCounter & 0xffffffff);

  // Use a HMAC-SHA1 to compute the hash
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(new Uint8Array(timeBuffer));

  // Get the digest and extract the offset
  const digest = hmac.digest();
  const offset = digest[digest.length - 1] & 0xf;

  // Extract a 4-byte dynamic binary code from the digest
  const dynamicBinaryCode =
    (digest[offset] & 0x7f) << 24 |
    (digest[offset + 1] & 0xff) << 16 |
    (digest[offset + 2] & 0xff) << 8 |
    (digest[offset + 3] & 0xff);

  // Truncate the dynamic code to the desired number of digits
  const truncatedCode = dynamicBinaryCode % Math.pow(10, digits);

  // Left-pad the code with zeros if needed
  const totp = truncatedCode.toString().padStart(digits, '0');

  return totp;
}


module.exports = {generateTOTP};