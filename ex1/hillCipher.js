const {
  mod,
  gcd,
  modInverse,
  determinant,
  cofactorMatrix,
  transpose,
  multiplyVectorMatrix
} = require("./math");

/* ---------- BASIC HELPERS ---------- */
const charToNum = c => c.charCodeAt(0) - 65;
const numToChar = n =>
  String.fromCharCode((n % mod + mod) % mod + 65);

const cleanText = t =>
  t.toUpperCase().replace(/[^A-Z]/g, "");

const modVector = v =>
  v.map(x => ((x % mod) + mod) % mod);

/* ---------- INVERSE MATRIX ---------- */
function inverseMatrix(m) {
  const det = determinant(m);
  if (gcd(det, mod) !== 1) return null;

  const detInv = modInverse(det);
  const cof = cofactorMatrix(m);
  const adj = transpose(cof);

  const inv = adj.map(row =>
    row.map(x => ((x * detInv) % mod + mod) % mod)
  );

  return { det, detInv, cof, adj, inv };
}

/* ---------- ENCRYPT ---------- */
exports.encrypt = (text, key, n) => {
  text = cleanText(text);

  while (text.length % n !== 0) text += "X";

  let steps = [];
  let cipher = "";

  for (let i = 0; i < text.length; i += n) {
    let block = text.slice(i, i + n);
    let P = [...block].map(charToNum);

    let mult = multiplyVectorMatrix(P, key);
    let C = modVector(mult);

    cipher += C.map(numToChar).join("");

    steps.push({
      block,
      plainVector: P,
      multiplied: mult,
      mod26: C
    });
  }

  return {
    formula: "C = P × K (mod 26)",
    steps,
    cipherText: cipher
  };
};

/* ---------- DECRYPT  ---------- */
exports.decrypt = (text, key, n) => {
  text = cleanText(text);

  while (text.length % n !== 0) text += "X";

  const invData = inverseMatrix(key);
  if (!invData)
    return { error: "Key matrix not invertible mod 26" };

  let steps = [];
  let plain = "";

  for (let i = 0; i < text.length; i += n) {
    let block = text.slice(i, i + n);
    let C = [...block].map(charToNum);

    let mult = multiplyVectorMatrix(C, invData.inv);
    let P = modVector(mult);

    plain += P.map(numToChar).join("");

    steps.push({
      block,
      cipherVector: C,
      multiplied: mult,
      mod26: P
    });
  }

  return {
    formula: "P = C × K⁻¹ (mod 26)",
    determinant: invData.det,
    determinantInverse: invData.detInv,
    cofactorMatrix: invData.cof,
    cofactorTranspose: invData.adj,
    inverseMatrix: invData.inv,
    steps,
    plainText: plain   
  };
};
