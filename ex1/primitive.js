const { modPowSimple } = require("./math");

function findPrimitiveRoots(p) {
  let steps = [];
  let roots = [];

  if (p <= 1) {
    return { error: "Enter a prime number greater than 1" };
  }

  steps.push(`Given number p = ${p}`);
  steps.push(`a^i (mod p) for i = 1 to ${p - 1}`);
  

  for (let g = 2; g < p; g++) {
    let set = new Set();
    steps.push(`Checking a = ${g}`);

    for (let i = 1; i < p; i++) {
      let value = modPowSimple(g, i, p);
      set.add(value);
      steps.push(`  ${g}^${i} mod ${p} = ${value}`);
    }

    steps.push(`  Unique values count = ${set.size}`);

    if (set.size === p - 1) {
      steps.push(`  ${g} is a primitive root\n`);
      roots.push(g);
    } else {
      steps.push(`  ${g} is NOT a primitive root\n`);
    }
  }

  return { roots, steps };
}

module.exports = { findPrimitiveRoots };
