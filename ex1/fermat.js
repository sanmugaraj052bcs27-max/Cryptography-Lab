const { modPow } = require("./math");

const fermatPrimalityTest = (a, p) => {
  let steps = [];

  steps.push(`Given number p = ${p}`);
  steps.push(`Given a = ${a}`);
  steps.push(`Using Fermat's Test: a^(p−1) ≡ 1 (mod p)`);

  if (p <= 1) {
    steps.push(`Invalid input: p must be greater than 1`);
    return {
      steps,
      result: "Invalid Input",
      isPrime: false
    };
  }

  // FIX HERE
  if (a >= p) {
    steps.push(`Invalid input: a must be less than p`);
    steps.push(`Since a = ${a} ≥ p = ${p}`);
    steps.push(`⇒ Fermat's Test cannot be applied`);

    return {
      steps,
      result: "Invalid Input",
      isPrime: false
    };
  }

  const power = p - 1;
  const value = modPow(a, power, p);

  steps.push(`Compute ${a}^(${p}-1) mod ${p}`);
  steps.push(`${a}^${power} mod ${p} = ${value}`);

  if (value !== 1) {
    steps.push(`Since result ≠ 1`);
    steps.push(`⇒ p is COMPOSITE`);

    return {
      steps,
      result: "Composite",
      isPrime: false
    };
  }

  steps.push(`Since result = 1`);
  steps.push(`⇒ p is PROBABLY PRIME`);

  return {
    steps,
    result: "Probably Prime",
    isPrime: true
  };
};

module.exports = {
  fermatPrimalityTest
};
