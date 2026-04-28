async function loadResources() {
    try {
        const res = await fetch("http://localhost:5000/getservices");
        const services = await res.json();

        const tableBody = document.getElementById("resourceTableBody");
        tableBody.innerHTML = "";

        services.forEach(service => {
            const row = `
                <tr>
                    <td style="font-weight: bold; text-align: left; padding-left: 50px;">${service.name}</td>
                    <td>
                        <span class="badge ${service.type.toLowerCase()}">${service.type}</span>
                    </td>
                    <td><span style="color: green;">● Available</span></td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (err) {
        console.error("Error loading services:", err);
    }
}
document.getElementById("resourceSearch").addEventListener("input", function (e) {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll("#resourceTableBody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? "" : "none";
    });
});

loadResources();