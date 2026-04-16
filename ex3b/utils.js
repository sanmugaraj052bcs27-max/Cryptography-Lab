// Fast Modular Exponentiation
function modExp(base, exp, mod) {
    let result = 1n;
    base = BigInt(base) % BigInt(mod);
    exp = BigInt(exp);
    mod = BigInt(mod);

    while (exp > 0n) {
        if (exp % 2n === 1n) result = (result * base) % mod;
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

// Fermat Primality Test
function isPrimeFermat(n, k = 5) {
    n = BigInt(n);
    if (n <= 1n) return false;
    if (n <= 3n) return true;

    for (let i = 0; i < k; i++) {
        let a = 2n + BigInt(Math.floor(Math.random() * Number(n - 4n)));
        if (modExp(a, n - 1n, n) !== 1n) return false;
    }
    return true;
}

// Primitive Root Check
function isPrimitiveRoot(g, p) {
    g = BigInt(g);
    p = BigInt(p);

    let required = new Set();
    for (let i = 1n; i < p; i++) required.add(i.toString());

    let actual = new Set();
    for (let i = 1n; i < p; i++) actual.add(modExp(g, i, p).toString());

    if (required.size !== actual.size) return false;
    for (let val of required) if (!actual.has(val)) return false;
    return true;
}

module.exports = { modExp, isPrimeFermat, isPrimitiveRoot };