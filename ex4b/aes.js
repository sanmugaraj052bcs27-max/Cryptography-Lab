// ================= AES TABLES =================
const SBOX = [
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
];

const RCON = [0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1B,0x36];

const INV_SBOX = new Array(256);
for (let i = 0; i < 256; i++) INV_SBOX[SBOX[i]] = i;
function invSubBytes(state) {
  return state.map(b => INV_SBOX[b]);
}
// ================= HELPERS =================
function textToBytes(text) {
  const bytes = [];
  for (let i = 0; i < 16; i++)
    bytes.push(text.charCodeAt(i) || 0);
  return bytes;
}
function bytesToText(bytes) {
  return bytes.map(b => String.fromCharCode(b)).join('').replace(/\0/g, '');
}
function hexToBytes(hex) {
  if (Array.isArray(hex)) return hex; // already byte array
  return hex.trim().split(/\s+/).map(h => parseInt(h, 16));
}
function invShiftRows(state) {
  return [
    state[0], state[13], state[10], state[7],
    state[4], state[1], state[14], state[11],
    state[8], state[5], state[2], state[15],
    state[12], state[9], state[6], state[3]
  ];
}

// Galois multiplication
function mul(a, b) {
  let result = 0;
  while (b > 0) {
    if (b & 1) result ^= a;
    a = xtime(a);
    b >>= 1;
  }
  return result;
}

function invMixColumns(state) {
  const out = [];
  for (let i = 0; i < 4; i++) {
    const col = state.slice(i*4, i*4+4);
    out.push(
      mul(col[0],14) ^ mul(col[1],11) ^ mul(col[2],13) ^ mul(col[3],9),
      mul(col[0],9)  ^ mul(col[1],14) ^ mul(col[2],11) ^ mul(col[3],13),
      mul(col[0],13) ^ mul(col[1],9)  ^ mul(col[2],14) ^ mul(col[3],11),
      mul(col[0],11) ^ mul(col[1],13) ^ mul(col[2],9)  ^ mul(col[3],14)
    );
  }
  return out;
}


function bytesToHex(bytes) {
  return bytes.map(b => b.toString(16).padStart(2,'0')).join(' ');
}

function subBytes(state) { return state.map(b => SBOX[b]); }
function shiftRows(state) {
  return [
    state[0], state[5], state[10], state[15],
    state[4], state[9], state[14], state[3],
    state[8], state[13], state[2], state[7],
    state[12], state[1], state[6], state[11]
  ];
}

function xtime(a) { return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff; }
function mixColumns(state) {
  const out = [];
  for (let i = 0; i < 4; i++) {
    const col = state.slice(i*4, i*4+4);
    out.push(
      xtime(col[0]) ^ xtime(col[1]) ^ col[1] ^ col[2] ^ col[3],
      col[0] ^ xtime(col[1]) ^ xtime(col[2]) ^ col[2] ^ col[3],
      col[0] ^ col[1] ^ xtime(col[2]) ^ xtime(col[3]) ^ col[3],
      xtime(col[0]) ^ col[0] ^ col[1] ^ col[2] ^ xtime(col[3])
    );
  }
  return out;
}

function addRoundKey(state, key) { return state.map((b,i) => b ^ key[i]); }

// ================= KEY SCHEDULE =================
function keySchedule(keyBytes) {
  const words = [];
  const steps = [];
  for (let i = 0; i < 4; i++) words[i] = keyBytes.slice(i*4, i*4+4);

  for (let i = 4; i < 44; i++) {
    let temp = words[i-1].slice();
    if (i % 4 === 0) {
      temp.push(temp.shift());
      temp = temp.map(b => SBOX[b]);
      temp[0] ^= RCON[(i/4)-1];
    }
    words[i] = words[i-4].map((b,j) => b ^ temp[j]);
  }
  words.forEach((w,i) => steps.push(`w${i}: ${bytesToHex(w)}`));
  return { words, steps };
}

// ================= AES BLOCK ENCRYPT =================
function aesEncryptBlock(block, key) {
  let steps = [];
  const { words, steps: keySteps } = keySchedule(key);
  steps.push("=== KEY SCHEDULE ==="); steps.push(...keySteps);

  let state = block.slice();
  steps.push("\nInitial State: " + bytesToHex(state));
  state = addRoundKey(state, words.flat().slice(0,16));
  steps.push("After AddRoundKey (Round 0): " + bytesToHex(state));

  for (let round=1; round<=9; round++) {
    steps.push(`\nROUND ${round}`);
    state = subBytes(state); steps.push("After SubBytes: " + bytesToHex(state));
    state = shiftRows(state); steps.push("After ShiftRows: " + bytesToHex(state));
    state = mixColumns(state); steps.push("After MixColumns: " + bytesToHex(state));
    const roundKey = words.flat().slice(round*16, round*16+16);
    state = addRoundKey(state, roundKey); steps.push("After AddRoundKey: " + bytesToHex(state));
  }

  steps.push("\nFINAL ROUND");
  state = subBytes(state); steps.push("After SubBytes: " + bytesToHex(state));
  state = shiftRows(state); steps.push("After ShiftRows: " + bytesToHex(state));
  const finalKey = words.flat().slice(160,176);
  state = addRoundKey(state, finalKey);
  steps.push("Ciphertext: " + bytesToHex(state));

  return { cipher: state, steps: steps.join("\n") };
}

function aesDecryptBlock(cipher, key) {
  let steps = [];
  const { words } = keySchedule(key);

  let state = cipher.slice();
  steps.push("Initial Cipher: " + bytesToHex(state));

  // Round 10 key
  let roundKey = words.flat().slice(160,176);
  state = addRoundKey(state, roundKey);
  steps.push("After AddRoundKey (Round 10): " + bytesToHex(state));

  for (let round = 9; round >= 1; round--) {
    steps.push(`\nROUND ${round}`);
    state = invShiftRows(state);
    steps.push("After InvShiftRows: " + bytesToHex(state));

    state = invSubBytes(state);
    steps.push("After InvSubBytes: " + bytesToHex(state));

    roundKey = words.flat().slice(round*16, round*16+16);
    state = addRoundKey(state, roundKey);
    steps.push("After AddRoundKey: " + bytesToHex(state));

    state = invMixColumns(state);
    steps.push("After InvMixColumns: " + bytesToHex(state));
  }

  // Final round
  steps.push("\nFINAL ROUND");
  state = invShiftRows(state);
  state = invSubBytes(state);
  roundKey = words.flat().slice(0,16);
  state = addRoundKey(state, roundKey);

  steps.push("Recovered Plaintext: " + bytesToHex(state));

  return { plain: state, steps: steps.join("\n") };
}

// ================= AES ECB MODE =================
function aesECB(text, key) {
  const block = textToBytes(text);
  const keyBytes = textToBytes(key);
  return aesEncryptBlock(block, keyBytes);
}
function splitBlocks(text) {
  let blocks = [];
  for (let i = 0; i < text.length; i += 16) {
    blocks.push(text.slice(i, i + 16));
  }
  return blocks;
}

function pad(text) {
  const blockSize = 16;
  const rem = text.length % blockSize;
  if (rem === 0) return text;
  return text + "\0".repeat(blockSize - rem);
}
// ================= AES CBC MODE =================
function aesCBC(text, key, iv) {
  const keyBytes = textToBytes(key);
  const ivBytes = textToBytes(iv);

  let steps = [];
  let padded = pad(text);
  let blocks = splitBlocks(padded);

  steps.push("Plaintext (padded): " + padded);
  steps.push("Blocks: " + JSON.stringify(blocks));

  let prev = ivBytes.slice();
  let cipherBlocks = [];

  blocks.forEach((blockText, index) => {
    steps.push(`\n===== BLOCK ${index + 1} =====`);

    const block = textToBytes(blockText);

    // XOR with IV / previous cipher
    const xorBlock = block.map((b, i) => b ^ prev[i]);
    steps.push("After XOR: " + bytesToHex(xorBlock));

    // Encrypt
    const enc = aesEncryptBlock(xorBlock, keyBytes);
    steps.push(enc.steps);

    // Store result
    prev = enc.cipher;
    cipherBlocks.push(enc.cipher);

    // Show each block cipher
    steps.push("Cipher Block " + (index + 1) + ": " + bytesToHex(enc.cipher));
  });

  // ✅ concatenate all blocks
  const finalCipherBytes = cipherBlocks.flat();

  const finalCipherHex = finalCipherBytes
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ');

  // 🔥 FINAL OUTPUT ADD
  steps.push("\n===== FINAL OUTPUT =====");
  steps.push("All Cipher Blocks (Concatenated):");
  steps.push(finalCipherHex);

  return {
    cipherBlocks,
    cipher: finalCipherBytes,
    finalHex: finalCipherHex,
    steps: steps.join("\n")
  };
}

// ================= AES CBC DECRYPT =================
function aesCBCDecrypt(cipherText, key, iv) {
  const keyBytes = textToBytes(key);
  const ivBytes = textToBytes(iv);
  const cipherBytes = hexToBytes(cipherText);

  const dec = aesDecryptBlock(cipherBytes, keyBytes);

  const plain = dec.plain.map((b,i) => b ^ ivBytes[i]);

  return {
    text: bytesToText(plain),       // ✅ string output
    hex: bytesToHex(plain),         // ✅ hex output
    steps:
      "=== CBC DECRYPT ===\nIV: " + bytesToHex(ivBytes) +
      "\n\n" + dec.steps +
      "\n\nAfter XOR with IV: " + bytesToHex(plain)
  };
}

// ================= AES ECB DECRYPT =================
function aesECBDecrypt(cipherText, key) {
  const keyBytes = textToBytes(key);
  const cipherBytes = hexToBytes(cipherText);

  const dec = aesDecryptBlock(cipherBytes, keyBytes);

  return {
    text: bytesToText(dec.plain),      // ✅ string output
    hex: bytesToHex(dec.plain),        // ✅ hex output (optional)
    steps: dec.steps
  };
}
module.exports = { aesECB, aesCBC, aesECBDecrypt, aesCBCDecrypt };