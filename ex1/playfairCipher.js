// playfairCipher.js

function generateMatrix(key) {
  key = key.toUpperCase().replace(/J/g, "I");
  let matrix = [];
  let used = new Set();

  for (let c of key + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
    if (!used.has(c)) {
      used.add(c);
      matrix.push(c);
    }
  }
  return matrix;
}

function prepareText(text) {
  text = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  let res = "";
  let i = 0;

  while (i < text.length) {
    let a = text[i];
    let b = text[i + 1];

    if (!b) {
      res += a + "X";
      i++;
    } else if (a === b) {
      res += a + "X";
      i++;
    } else {
      res += a + b;
      i += 2;
    }
  }
  return res;
}

function rule(a, b, matrix, dir) {
  let p1 = matrix.indexOf(a);
  let p2 = matrix.indexOf(b);

  let r1 = Math.floor(p1 / 5), c1 = p1 % 5;
  let r2 = Math.floor(p2 / 5), c2 = p2 % 5;

  if (r1 === r2) {
    return (
      matrix[r1 * 5 + (c1 + dir + 5) % 5] +
      matrix[r2 * 5 + (c2 + dir + 5) % 5]
    );
  }

  if (c1 === c2) {
    return (
      matrix[((r1 + dir + 5) % 5) * 5 + c1] +
      matrix[((r2 + dir + 5) % 5) * 5 + c2]
    );
  }

  return matrix[r1 * 5 + c2] + matrix[r2 * 5 + c1];
}

function encrypt(text, key) {
  let matrix = generateMatrix(key);
  let prepared = prepareText(text);

  let cipher = "";
  let pairs = [];   

  for (let i = 0; i < prepared.length; i += 2) {
    let plainPair = prepared[i] + prepared[i + 1];
    let cipherPair = rule(prepared[i], prepared[i + 1], matrix, 1);

    cipher += cipherPair;
    pairs.push(`${plainPair} → ${cipherPair}`);
  }

  return {
    result: cipher,
    matrix,
    pairs
  };
}

function decrypt(text, key) {
  let matrix = generateMatrix(key);
  text = text.toUpperCase().replace(/[^A-Z]/g, "");

  let decryptedText = "";
  let pairs = [];

  for (let i = 0; i < text.length; i += 2) {
    let cipherPair = text[i] + text[i + 1];
    let plainPair = rule(text[i], text[i + 1], matrix, -1);

    decryptedText += plainPair;
    pairs.push(`${cipherPair} → ${plainPair}`);
  }

  let result = "";
  for (let i = 0; i < decryptedText.length; i++) {
    let current = decryptedText[i];
    let next = decryptedText[i + 1];
    let prev = decryptedText[i - 1];
    const len = decryptedText.length;

    if (current === "X") {
      if (prev && next && prev === next) continue; 
      if (i === decryptedText.length - 1)
        if(prev == 'X')
          continue; 
    }
    result += current;
  }

  return {
    result: result,
    matrix,
    pairs
  };
}



module.exports = { encrypt, decrypt };
