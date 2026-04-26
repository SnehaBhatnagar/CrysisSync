async function loadSOS() {
  try {
    // 🔗 Fetch data from backend
    const res = await fetch("http://localhost:5000/getsos");
    const data = await res.json();

    console.log("SOS DATA:", data);

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    // 🧠 Loop through each SOS entry
    data.forEach(item => {
      const dateObj = new Date(item.time);

      const date = dateObj.toLocaleDateString();
      const time = dateObj.toLocaleTimeString();

      // 📦 Create table row
      const row = `
        <tr>
          <td>${date}</td>
          <td>${time}</td>
          <td>${item.emergency}</td>
          <td>${item.location}</td>
          <td>${item.description}</td>
          <td>Pending</td>
          <td><button>Resolve</button></td>
        </tr>
      `;

      // ➕ Add row to table
      tableBody.innerHTML += row;
    });

  } catch (err) {
    console.log("ERROR:", err);
  }
}

// 🚀 Run when page loads
loadSOS();

// 🔄 Auto refresh every 5 seconds
setInterval(loadSOS, 5000);