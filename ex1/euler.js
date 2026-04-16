// euler.js
const { gcd, modPow, primeFactors } = require("./math");

const fermatTest = (a, n) => {
  if (gcd(a, n) !== 1) return false;
  return modPow(a, n - 1, n) === 1;
};

const eulerTotient = (n, a) => {
  let steps = [];

  steps.push(`Given n = ${n}`);
  steps.push(`Step 1: Apply Fermat Primality Test using a = ${a}`);
  steps.push(`Check: a^(n−1) mod n`);

  if (fermatTest(a, n)) {
    steps.push(`Result = 1`);
    steps.push(`⇒ n is PROBABLY PRIME`);
    steps.push(`Using formula: φ(n) = n − 1`);
    steps.push(`Final φ(${n}) = ${n - 1}`);

    return {
      phi: n - 1,
      steps
    };
  }

  steps.push(`Result ≠ 1`);
  steps.push(`⇒ n is COMPOSITE`);

  steps.push(`Step 2: Find prime factors of n`);
  const factors = primeFactors(n);
  steps.push(`Prime factors = ${factors.join(", ")}`);

  steps.push(`Step 3: Apply Euler Totient Formula`);
  steps.push(`φ(n) = n × Π (1 − 1/p)`);

  /* -------- FORMATTED STEP 3 -------- */
  let formula = `φ(${n}) = ${n} × [`;
  factors.forEach((p, i) => {
    formula += `(1 − 1/${p})`;
  });
  formula += `]`;

  steps.push(formula);

  let phi = n;
  factors.forEach(p => {
    phi *= (1 - 1 / p);
  });

  steps.push(`= ${phi}`);
  steps.push(`Final φ(${n}) = ${phi}`);

  return {
    phi,
    steps
  };
};

module.exports = { eulerTotient };
