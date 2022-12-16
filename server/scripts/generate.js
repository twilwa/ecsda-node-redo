const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();

console.log("private key:", toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log("public key:", toHex(publicKey));

console.log("public key hash:", toHex(keccak256(publicKey.slice(1))));

console.log(
  "eth address: 0x" + toHex(keccak256(publicKey.slice(1))).slice(-20)
);
