async function encrypt() {
  const plaintext = document.getElementById("plaintext").value.trim();
  const key = document.getElementById("key").value.trim();
  const iv = document.getElementById("iv").value.trim();

  const res = await fetch("/encrypt", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ plaintext, key, iv })
  });

  const data = await res.json();

  document.getElementById("output").textContent =
    "Ciphertext:\n" + data.ciphertext +
    "\n\n===== STEPS =====\n" +
    data.logs.join("\n");
}
