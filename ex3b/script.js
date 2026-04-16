async function compute() {
    const q = Number(document.getElementById("q").value);
    const alpha = Number(document.getElementById("alpha").value);
    const a = Number(document.getElementById("a").value);
    const b = Number(document.getElementById("b").value);

    const output = document.getElementById("finalKey");

    output.innerHTML = " Computing...";

    try {
        const res = await fetch("/compute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ q, alpha, a, b })
        });

        const data = await res.json();

        if (data.error) {
            output.innerHTML = `<span style="color:red;">❌ ${data.error}</span>`;
        } else {
            let html = "<ul>";
            data.steps.forEach(step => {
                html += `<li>${step}</li>`;
            });
            html += "</ul>";

            output.innerHTML = html;
        }

    } catch (err) {
        output.innerHTML = "❌ Server error!";
        console.error(err);
    }
}