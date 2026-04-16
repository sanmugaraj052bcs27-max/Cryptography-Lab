
const mod = 26;

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const modInverse = (a) => {
  a = ((a % mod) + mod) % mod;
  for (let x = 1; x < mod; x++) {
    if ((a * x) % mod === 1) return x;
  }
  return null;
};


const multiplyVectorMatrix = (vec, mat) => {
  let result = [];
  for (let j = 0; j < mat[0].length; j++) {
    let sum = 0;
    for (let i = 0; i < vec.length; i++) {
      sum += vec[i] * mat[i][j];
    }
    result.push(sum);
  }
  return result;
};

const minor = (m, r, c) =>
  m
    .filter((_, i) => i !== r)
    .map(row => row.filter((_, j) => j !== c));

const determinant = (m) => {
  if (m.length === 2)
    return m[0][0] * m[1][1] - m[0][1] * m[1][0];

  let det = 0;
  for (let c = 0; c < m.length; c++) {
    det += ((c % 2 === 0 ? 1 : -1) *
      m[0][c] * determinant(minor(m, 0, c)));
  }
  return det;
};

const cofactorMatrix = (m) =>
  m.map((row, i) =>
    row.map((_, j) =>
      ((i + j) % 2 === 0 ? 1 : -1) *
      determinant(minor(m, i, j))
    )
  );

const transpose = (m) =>
  m[0].map((_, i) => m.map(row => row[i]));

const extendedGCD = (a, b) => {
  if (b === 0) {
    return { gcd: a, x: 1, y: 0 };
  }
  const res = extendedGCD(b, a % b);
  return {
    gcd: res.gcd,
    x: res.y,
    y: res.x - Math.floor(a / b) * res.y
  };
};

const phi = (n) => {
  let result = n;
  let p = 2;

  while (p * p <= n) {
    if (n % p === 0) {
      while (n % p === 0) n /= p;
      result -= result / p;
    }
    p++;
  }

  if (n > 1) result -= result / n;
  return result;
};

const primeFactors = (n) => {
  let factors = new Set();
  while (n % 2 === 0) {
    factors.add(2);
    n /= 2;
  }

  for (let i = 3; i * i <= n; i += 2) {
    while (n % i === 0) {
      factors.add(i);
      n /= i;
    }
  }

  if (n > 2) factors.add(n);
  return [...factors];
};

const modPow = (base, exp, mod) => {
  let result = 1;
  base %= mod;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % mod;
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }
  return result;
};

const modPowSimple = (base, exp, mod) => {
  let result = 1;
  for (let i = 0; i < exp; i++) {
    result = (result * base) % mod;
  }
  return result;
};

const isPrime = (n) => {
  if (n <= 1) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};


module.exports = {
  mod,
  gcd,
  modInverse,
  determinant,
  cofactorMatrix,
  transpose,
  multiplyVectorMatrix,
  extendedGCD,
  phi,
  primeFactors,
  modPowSimple,
  isPrime,
  modPow
};


