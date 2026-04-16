const express = require("express");
const router = express.Router();

/* IMPORT CIPHERS */
const shift = require("../ciphers/shiftCipher");
const playfair = require("../ciphers/playfairCipher");
const hill = require("../ciphers/hillCipher");
const primitive = require("../ciphers/primitive");
const fermat = require("../ciphers/fermat");
const matrix = require("../ciphers/matrix");
const euler = require("../ciphers/euler");



/* ---------------- SHIFT CIPHER ---------------- */
router.post("/shift", (req, res) => {
  const { text, key, mode } = req.body;

  const output =
    mode === "decrypt"
      ? shift.decrypt(text, key)
      : shift.encrypt(text, key);
      
  res.json(output);
});

/* ---------------- PLAYFAIR CIPHER ---------------- */
router.post("/playfair", (req, res) => {
  const { text, key, mode } = req.body;

  const output =
    mode === "decrypt"
      ? playfair.decrypt(text, key)
      : playfair.encrypt(text, key);

  res.json(output);
});

/* ---------------- HILL CIPHER : ENCRYPT ---------------- */
router.post("/hill/encrypt", (req, res) => {
  const { text, keyMatrix, n } = req.body;

  const output = hill.encrypt(text, keyMatrix, n);
  res.json(output);
});

/* ---------------- HILL CIPHER : DECRYPT ---------------- */
router.post("/hill/decrypt", (req, res) => {
  const { text, keyMatrix, n } = req.body;

  const output = hill.decrypt(text, keyMatrix, n);
  res.json(output);
});

/* ---------------- PRIMITIVE ROOT ---------------- */
router.post("/primitive", (req, res) => {
  const { n } = req.body;
  const output = primitive.findPrimitiveRoots(n);
  res.json(output);
});

/* ---------------- FERMAT THEOREM ---------------- */
router.post("/fermat", (req, res) => {
  const { a, p } = req.body;
  const output = fermat.fermatPrimalityTest(a, p);
  res.json(output);
});



router.post("/matrix/det", (req, res) =>
  res.json(matrix.det(req.body.matrix))
);

router.post("/matrix/gcd", (req, res) =>
  res.json(matrix.gcdAll(req.body.matrix))
);

router.post("/matrix/cofactor", (req, res) =>
  res.json(matrix.cofactor(req.body.matrix))
);

router.post("/matrix/transpose", (req, res) =>
  res.json(matrix.transposeMat(req.body.matrix))
);

router.post("/matrix/inverse", (req, res) =>
  res.json(matrix.inverse(req.body.matrix))
);

router.post("/matrix/extended", (req, res) =>
  res.json(matrix.extended(req.body.a, req.body.b))
);

/* ---------------- EULER TOTIENT ---------------- */
router.post("/euler", (req, res) => {
  const { n, a } = req.body;
  const output = euler.eulerTotient(n, a);
  res.json(output);
});


module.exports = router;
