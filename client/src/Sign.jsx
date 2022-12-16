import * as secp from "ethereum-cryptography/secp256k1";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { setMessage } from "./Transfer";

function signature(privateKey) {
  let msg = utf8ToBytes("arbitrary data");
  const signature = secp.sign(msg, privateKey, { recovered: true });
  return signature;
}
