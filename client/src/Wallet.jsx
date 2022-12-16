import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function getAddress(publicKey) {
  let hash = keccak256(publicKey.slice(1));
  return toHex(hash.slice(-20));
}

function hashMessage(message) {
  let bytes = utf8ToBytes(message);
  return keccak256(bytes);
}

async function getSignature(privateKey) {
  const msg = hashMessage("Approving transaction");
  let response = await secp.sign(msg, privateKey, { recovered: true });
  return response;
}

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  publicKey,
  setPublicKey,
  signature,
  setSignature,
  recoveryBit,
  setRecoveryBit,
}) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);

    let publicKey = secp.getPublicKey(privateKey);
    setPublicKey(toHex(publicKey));
    console.log("public key", publicKey);

    const address = getAddress(secp.getPublicKey(privateKey));
    setAddress("0x" + address);

    let response = await getSignature(privateKey);
    let [signature, recoveryBit] = response;
    console.log("Signature:", signature);
    console.log("Recovery Bit:", recoveryBit);
    setSignature(toHex(signature));
    setRecoveryBit(recoveryBit);

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${"0x" + address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Sign Transaction:</h1>

      <label>
        Private Key
        <input
          placeholder="Type an Private Key..."
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="output">Balance: {balance}</div>
      <div className="output">Public Key: {publicKey}</div>
      <div className="output">Address: {address}</div>
      <div className="output">Signature: {signature}</div>
      <div className="output">Recovery Bit: {recoveryBit}</div>
    </div>
  );
}

export default Wallet;
