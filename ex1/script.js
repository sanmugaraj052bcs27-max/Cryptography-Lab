
let lastHillDecryptData = null;
let currentMatrix = null;

function showMatrix() {
  shift.style.display = "none";
  playfair.style.display = "none";
  hill.style.display = "none";
  primitive.style.display = "none";
  matrixOp.style.display = "block";
  fermat.style.display = "none";
  euler.style.display = "none";
}

function showShift() {
  shift.style.display = "block";
  playfair.style.display = "none";
  hill.style.display = "none";
  primitve.style.display = "none";
  matrixOp.style.display = "none";
  fermat.style.display = "none";
  euler.style.display = "none";
}

function showPlayfair() {
  shift.style.display = "none";
  playfair.style.display = "block";
  hill.style.display = "none";
  primitive.style.display = "none";
  matrixOp.style.display = "none";
  fermat.style.display = "none";
  euler.style.display = "none";
}

function showHill() {
  shift.style.display = "none";
  playfair.style.display = "none";
  hill.style.display = "block";
  primitive.style.display = "none";
  matrixOp.style.display = "none";
  fermat.style.display = "none";
  euler.style.display = "none";
}

function showPrimitive() {
  shift.style.display = "none";
  playfair.style.display = "none";
  hill.style.display = "none";
  primitive.style.display = "block";
  matrixOp.style.display = "none";
  fermat.style.display = "none";
  euler.style.display = "none";
}

function showFermat() {
  shift.style.display = "none";
  playfair.style.display = "none";
  hill.style.display = "none";
  primitive.style.display = "none";
  fermat.style.display = "block";
  matrixOp.style.display = "none";
  euler.style.display = "none";
}

function showEuler() {
  shift.style.display = "none";
  playfair.style.display = "none";
  hill.style.display = "none";
  primitive.style.display = "none";
  fermat.style.display = "none";
  euler.style.display = "block";
}



function shiftAction(mode) {
  fetch("/api/shift", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: shiftText.value,
      key: shiftKey.value,
      mode
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.error) {
      shiftResult.innerHTML = `<b>Error:</b> ${data.error}`;
      return;
    }
    shiftResult.innerHTML = `
      <b>Numbers :</b> ${data.plainNumbers.join(" , ")}<br><br>
      <b>Cipher Numbers :</b> ${data.cipherNumbers.join(" , ")}<br><br>
      <b>Cipher Text :</b> ${data.cipherText}<br>
      
    `;
  });
}


function playfairAction(mode) {
  fetch("/api/playfair", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: pfText.value,
      key: pfKey.value,
      mode
    })
  })
  .then(res => res.json())
  .then(data => {

    // RESULT
    pfResult.innerText = "RESULT: " + data.result;

    // MATRIX
    let table = "";
    for (let i = 0; i < 5; i++) {
      table += "<tr>";
      for (let j = 0; j < 5; j++) {
        table += `<td>${data.matrix[i * 5 + j]}</td>`;
      }
      table += "</tr>";
    }
    matrix.innerHTML = table;

    
    pfBigrams.innerText = "Bigram Mapping: " + data.pairs.join(" , ");
  });
}



/* ---------- HILL ENCRYPT / DECRYPT ---------- */
function hillEncrypt() {
  hillAction("/api/hill/encrypt");
}

function hillDecrypt() {
  hillAction("/api/hill/decrypt");
}

/* ---------- HILL MAIN HANDLER ---------- */
function hillAction(url) {
  let text = hillText.value;
  let n = parseInt(hillN.value);

  let rawKey = hillKey.value.trim();
  let keyArr = [];

 
  if (rawKey.includes(",")) {
    keyArr = rawKey.split(",").map(x => parseInt(x.trim()));
  } else {
    rawKey = rawKey.toUpperCase().replace(/[^A-Z]/g, "");

    if (rawKey.length !== n * n) {
      hillResult.innerHTML =
        `<b>Error:</b> Key text length must be ${n * n}`;
      hillSteps.innerHTML = "";
      return;
    }

    keyArr = [...rawKey].map(c => c.charCodeAt(0) - 65);
  }

  /* ---------- BUILD KEY MATRIX ---------- */
  let keyMatrix = [];
  for (let i = 0; i < keyArr.length; i += n) {
    keyMatrix.push(keyArr.slice(i, i + n));
  }

  let keyHtml = `<b>Key Matrix (K):</b><br>${matrixToTable(keyMatrix)}<br>`;
  hillSteps.innerHTML = keyHtml;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      keyMatrix,
      n
    })
  })
  .then(res => res.json())
  .then(data => {

    if (data.error) {
      hillResult.innerHTML = `<b>Error:</b> ${data.error}`;
      hillSteps.innerHTML = "";
      return;
    }

    if (url.includes("decrypt")) {
      lastHillDecryptData = data;
    }

    let html = keyHtml;
    html += `<b>Formula:</b> ${data.formula}<br><br>`;

    if (data.determinant !== undefined) {
      html += `<b>|K| :</b> ${data.determinant}<br>`;
      html += `<b>|K|⁻¹ :</b> ${data.determinantInverse}<br><br>`;

      html += `<b>Cofactor Matrix</b><br>`;
      html += matrixToTable(data.cofactorMatrix) + "<br>";

      html += `<b>Cofactor Transpose (Adjoint)</b><br>`;
      html += matrixToTable(data.cofactorTranspose) + "<br>";

      html += `<b>Inverse Key Matrix (K⁻¹)</b><br>`;
      html += matrixToTable(data.inverseMatrix) + "<br>";
    }

    data.steps.forEach((s, i) => {
      html += `<hr><b>Block ${i + 1} : ${s.block}</b><br><br>`;

      if (s.plainVector) {
        html += `<b>P (Plain Vector)</b><br>`;
        html += vectorToTable(s.plainVector) + "<br>";
      }

      if (s.cipherVector) {
        html += `<b>C (Cipher Vector)</b><br>`;
        html += vectorToTable(s.cipherVector) + "<br>";
      }

      html += `<b>After Multiplication</b><br>`;
      html += vectorToTable(s.multiplied) + "<br>";

      html += `<b>After mod 26</b><br>`;
      html += vectorToTable(s.mod26) + "<br>";
    });

    hillSteps.innerHTML = html;
    hillResult.innerHTML =
      `<b>Final Result :</b> ${data.cipherText || data.plainText}`;
  });
}


function matrixToTable(matrix) {
  let html = "<table class='matrix'>";
  matrix.forEach(row => {
    html += "<tr>";
    row.forEach(val => {
      html += `<td>${val}</td>`;
    });
    html += "</tr>";
  });
  html += "</table>";
  return html;
}

function vectorToTable(vector, type = "row") {
  let html = "<table class='matrix'><tr>";
  if (type === "row") {
    vector.forEach(v => html += `<td>${v}</td>`);
    html += "</tr>";
  } else {
    html = "<table class='matrix'>";
    vector.forEach(v => html += `<tr><td>${v}</td></tr>`);
  }
  html += "</table>";
  return html;
}

function viewDeterminant() {
  if (!lastHillDecryptData) {
    alert("Please perform Hill Decryption first");
    return;
  }
  hillSteps.innerHTML =
    `<b>|K| (Determinant)</b><br>${lastHillDecryptData.determinant}`;
}

function viewCofactor() {
  if (!lastHillDecryptData) {
    alert("Please perform Hill Decryption first");
    return;
  }
  hillSteps.innerHTML =
    `<b>Cofactor Matrix</b><br>` +
    matrixToTable(lastHillDecryptData.cofactorMatrix);
}

function viewTranspose() {
  if (!lastHillDecryptData) {
    alert("Please perform Hill Decryption first");
    return;
  }
  hillSteps.innerHTML =
    `<b>Cofactor Transpose (Adjoint)</b><br>` +
    matrixToTable(lastHillDecryptData.cofactorTranspose);
}

function viewInverse() {
  if (!lastHillDecryptData) {
    alert("Please perform Hill Decryption first");
    return;
  }
  hillSteps.innerHTML =
    `<b>Inverse Key Matrix (K⁻¹)</b><br>` +
    matrixToTable(lastHillDecryptData.inverseMatrix);
}



function findPrimitiveRoots() {
  let n = parseInt(prN.value);

  fetch("/api/primitive", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ n })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      prResult.innerHTML = `<b>Error:</b> ${data.error}`;
      prSteps.innerText = "";
      return;
    }

    prSteps.innerText = data.steps.join("\n");
    prResult.innerHTML =
      `<b>Primitive Roots of ${n} :</b> ${data.roots.join(", ")}`;
  });
}

function fermatAction() {
  let a = parseInt(fermatA.value);
  let p = parseInt(fermatP.value);

  fetch("/api/fermat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ a, p })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      fermatResult.innerHTML = `<b>Error:</b> ${data.error}`;
      fermatSteps.innerHTML = "";
      return;
    }

    fermatSteps.innerHTML = data.steps.join("\n");
  });
}


function buildMatrix() {
  let n = parseInt(matN.value);
  let raw = matKey.value.trim();
  let arr = [];

  if (raw.includes(",")) {
    arr = raw.split(",").map(x => parseInt(x.trim()));
  } else {
    raw = raw.toUpperCase().replace(/[^A-Z]/g, "");
    if (raw.length !== n * n) {
      matSteps.innerText = "Invalid key length";
      return;
    }
    arr = [...raw].map(c => c.charCodeAt(0) - 65);
  }

  currentMatrix = [];
  for (let i = 0; i < arr.length; i += n) {
    currentMatrix.push(arr.slice(i, i + n));
  }

  matDisplay.innerHTML = matrixToTable(currentMatrix);
  matSteps.innerText = "Matrix built successfully";
}

function matrixDet() {
  callMatrixAPI("/api/matrix/det");
}

function matrixGCD() {
  callMatrixAPI("/api/matrix/gcd");
}

function matrixCofactor() {
  callMatrixAPI("/api/matrix/cofactor");
}

function matrixTranspose() {
  callMatrixAPI("/api/matrix/transpose");
}

function matrixInverse() {
  callMatrixAPI("/api/matrix/inverse");
}

function extendedEuclid() {
  fetch("/api/matrix/extended", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      a: parseInt(eeA.value),
      b: parseInt(eeB.value)
    })
  })
  .then(res => res.json())
  .then(data => {
    matSteps.innerText =
      `gcd = ${data.gcd}\nx = ${data.x}\ny = ${data.y}\n\n${data.steps.join("\n")}`;
  });
}

function callMatrixAPI(url) {
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matrix: currentMatrix })
  })
  .then(res => res.json())
  .then(data => {
    if (data.matrix) {
      matSteps.innerHTML =
        data.steps.join("<br>") + "<br><br>" + matrixToTable(data.matrix);
    } else {
      matSteps.innerText = data.steps.join("\n");
    }
  });
}

function eulerAction() {
  let n = parseInt(eulerN.value);
  let a = parseInt(eulerA.value);

  fetch("/api/euler", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ n, a })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      eulerResult.innerHTML = `<b>Error:</b> ${data.error}`;
      eulerSteps.innerHTML = "";
      return;
    }

    eulerSteps.innerHTML = data.steps.join("\n");
    eulerResult.innerHTML = `<b>φ(${n}) = ${data.phi}</b>`;
  });
}
