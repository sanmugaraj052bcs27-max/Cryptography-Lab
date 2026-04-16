const {
  determinant,
  cofactorMatrix,
  transpose,
  modInverse,
  extendedGCD,
  gcd
} = require("./math");

const mod = 26;

exports.det = (matrix) => ({
  steps: [`Determinant calculation`, `|A| = ${determinant(matrix)}`]
});

exports.gcdAll = (matrix) => {
  let flat = matrix.flat();
  let g = flat.reduce((a, b) => gcd(a, b));
  return { steps: [`GCD of all elements = ${g}`] };
};

exports.cofactor = (matrix) => ({
  matrix: cofactorMatrix(matrix),
  steps: ["Cofactor matrix calculated"]
});

exports.transposeMat = (matrix) => ({
  matrix: transpose(matrix),
  steps: ["Transpose calculated"]
});

exports.inverse = (matrix) => {
  let det = determinant(matrix);
  let invDet = modInverse(det);

  if (invDet === null)
    return { steps: ["Inverse does not exist"] };

  let cof = cofactorMatrix(matrix);
  let adj = transpose(cof);

  let inv = adj.map(r =>
    r.map(v => (v * invDet) % mod)
  );

  return {
    matrix: inv,
    steps: [
      `|A| = ${det}`,
      `|A|⁻¹ mod 26 = ${invDet}`,
      "Inverse matrix calculated"
    ]
  };
};

exports.extended = (a, b) => {
  let res = extendedGCD(a, b);
  return {
    gcd: res.gcd,
    x: res.x,
    y: res.y,
    steps: [`${a}x + ${b}y = ${res.gcd}`]
  };
};
