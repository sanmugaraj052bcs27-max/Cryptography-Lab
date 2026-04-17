const express = require("express");
const bodyParser = require("body-parser");
const { desCBC, desECB, desECBDecrypt, desCBCDecrypt } = require("./des");
const { aesECB, aesCBC, aesECBDecrypt, aesCBCDecrypt } = require("./aes");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/des", (req, res) => {
  const { text, key, mode, action } = req.body;

if (!/^[0-9A-Fa-f]{16}$/.test(key)) {
  return res.send("Key must be 16 hexadecimal characters (64-bit)");
}

  let result;

  if (mode === "cbc" && action === "encrypt")
    result = desCBC(text, key);
  else if (mode === "ecb" && action === "encrypt")
    result = desECB(text, key);
  else if (mode === "cbc" && action === "decrypt")
    result = desCBCDecrypt(text, key);
  else if (mode === "ecb" && action === "decrypt")
    result = desECBDecrypt(text, key);
  else
    result = "Invalid mode/action";

  res.send(result.steps || result);
});


app.post("/aes", (req, res) => {
  const { text, key, iv, mode, action } = req.body;

  if (key.length !== 16)
    return res.send("AES Key must be 16 characters (128-bit)");

  let result;

  if (mode === "ecb" && action === "encrypt")
    result = aesECB(text, key);
  else if (mode === "ecb" && action === "decrypt")
    result = aesECBDecrypt(text, key);
  else if (mode === "cbc" && action === "encrypt")
    result = aesCBC(text, key, iv);
  else if (mode === "cbc" && action === "decrypt")
    result = aesCBCDecrypt(text, key, iv);
  else
    result = "Invalid mode/action";

  res.send(result.steps || result);
});

app.post("/cmac", (req, res) => {
  const { text, key, iv, bits } = req.body;

  if (key.length !== 16)
    return res.send("Key must be 16 chars");

  // Step 1: AES CBC (multi-block)
  const result = aesCBC(text, key, iv);

  // 🔥 Full ciphertext (all blocks)
  const fullCipher = result.finalHex;

  // 🔥 Last block மட்டும்
  const lastBlock = result.cipherBlocks[result.cipherBlocks.length - 1];
  const lastBlockHex = lastBlock
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');

  // Step 3: convert last block → binary
  let binary = lastBlock.map(b =>
    b.toString(2).padStart(8, '0')
  ).join('');

  // Step 4: எடுத்துக்க வேண்டிய bits (LEFT → RIGHT)
  const n = parseInt(bits);
  const cmacBits = binary.slice(0, n);   // 🔥 LEFT to RIGHT

  // Step 5: binary → hex
  let cmacHex = "";
  for (let i = 0; i < cmacBits.length; i += 8) {
    let byte = cmacBits.slice(i, i + 8);
    cmacHex += parseInt(byte, 2).toString(16).padStart(2, '0') + " ";
  }

  // ✅ FINAL OUTPUT
  res.send(
    "===== FULL CIPHERTEXT =====\n" +
    fullCipher +

    "\n\n===== LAST CIPHER BLOCK =====\n" +
    lastBlockHex +

    "\n\n===== CMAC (" + n + " bits) =====\n" +
    cmacHex.trim()
  );
});
app.listen(3000, () =>
  console.log("Server running → http://localhost:3000")
);
