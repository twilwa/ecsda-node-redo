import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes } from "ethereum-cryptography/utils";

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [signature, setSignature] = useState("");
  const [recoveryBit, setRecoveryBit] = useState("");
  const [message, setMessage] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    let msg = await hashMessage(setMessage);
    let recoveredPublicKey = secp.recoverPublicKey(
      msg,
      signature,
      parseInt(recoveryBit)
    );
    if (publicKey !== toHex(recoveredPublicKey)) {
      console.log(
        "Error: Recovered public key does not match the input public key"
      );
      alert("Invalid Key or Signature");
    } else {
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
          signature,
          recoveryBit: parseInt(recoveryBit),
          publicKey,
        });
        console.log(
          "Transferred",
          parseInt(sendAmount),
          "$TOKENS Successfully"
        );
        setBalance(balance);
      } catch (ex) {
        console.log("Transfer Failed", ex);
        alert(ex.response.data.message);
      }
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Input signature"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <label>
        Revovery Bit
        <input
          placeholder="Input recovery bit"
          value={recoveryBit}
          onChange={setValue(setRecoveryBit)}
        ></input>
      </label>

      <label>
        Public Key (to verify signature)
        <input
          placeholder="Type your public key..."
          value={publicKey}
          onChange={setValue(setPublicKey)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
