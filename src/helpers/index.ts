import crypto from "crypto"; //https://github.com/nodejs/node/blob/v20.1.0/lib/crypto.js
//btw, there is a crypto lib now built in Node.

const SECRET = "ANDY-REST_API"; // This is just a sample secret used to generate the hash for password. IRL, you would store this on a secure serverside.

export const random = () =>
  crypto.randomBytes(128).toString("base64"); //generate a 128 byte buffer of random data and converts the generated random bytes into a base64-encoded string

export const authentication = (salt: string, password: string) => {
  //this function is from the crypto doc.
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex"); //Hash based Message Authentication Code - 'hex' == hexadecimal
};
