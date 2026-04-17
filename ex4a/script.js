async function generateMD5() {
    const message = document.getElementById("message").value;

    const res = await fetch("/md5", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await res.json();

    document.getElementById("steps").textContent = data.steps;
    document.getElementById("result").textContent = data.hash;
}