/* ---------- SHIFT CIPHER ---------- */

function charToNum(c) {
  return c.charCodeAt(0) - 65;
}

function numToChar(n) {
  return String.fromCharCode(((n % 26) + 26) % 26 + 65);
}

function encrypt(text, key) {
  key = Number(key);

  // 🔴 Key validation
  if (isNaN(key) || key < 0 || key > 25) {
    return { error: "Key must be between 0 and 25" };
  }

  text = text.toUpperCase().replace(/[^A-Z]/g, "");

  let cipher = "";
  let plainNumbers = [];
  let cipherNumbers = [];

  for (let ch of text) {
    let p = charToNum(ch);
    let c = (p + key) % 26;

    plainNumbers.push(p);
    cipherNumbers.push(c);
    cipher += numToChar(c);
  }

  return {
    plainText: text,
    cipherText: cipher,
    plainNumbers,
    cipherNumbers
  };
}

function decrypt(text, key) {
  key = Number(key);

  if (isNaN(key) || key < 0 || key > 25) {
    return { error: "Key must be between 0 and 25" };
  }

  // decrypt = encrypt(text, 26 - key)
  return encrypt(text, 26 - key);
}

module.exports = { encrypt, decrypt };
