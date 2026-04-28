async function loadSOS() {
  try {
    const res = await fetch("http://localhost:5000/getsos");
    const data = await res.json();
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    data.forEach(item => {
      const dateObj = new Date(item.time);
      const row = document.createElement("tr");
      const isResolved = item.status === 'Resolved';
      const statusColor = isResolved ? "green" : "red";

      row.innerHTML = `
                <td>${dateObj.toLocaleDateString()}</td>
                <td>${dateObj.toLocaleTimeString()}</td>
                <td>${item.emergency}</td>
                <td>${item.location}</td>
                <td>${item.description || "No description"}</td>
                <td style="color: ${statusColor}; font-weight: bold;">${item.status || 'Pending'}</td>
                <td>
                    <button 
                        onclick="handleResponse('${item._id}', '${item.emergency}')" 
                        class="resolve-btn"
                        ${isResolved ? 'disabled style="background:#ccc; cursor:not-allowed;"' : ''}>
                        ${isResolved ? 'Done' : 'Response'}
                    </button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.log("ERROR:", err);
  }
}

let selectedSosId = null;

async function handleResponse(id, type) {
  selectedSosId = id;
  try {
    const res = await fetch("http://localhost:5000/getservices");
    const services = await res.json();

    const filteredServices = services.filter(s => {
      const sType = String(s.type).toLowerCase().trim();
      const sosType = String(type).toLowerCase().trim();
      return sType.includes(sosType) || sosType.includes(sType);
    });

    const select = document.getElementById("resourceSelect");
    select.innerHTML = "";

    if (filteredServices.length === 0) {
      select.innerHTML = `<option value="">No match found. Select manually:</option>`;
      services.forEach(s => {
        select.innerHTML += `<option value="${s.name}">${s.name} (${s.type})</option>`;
      });
    } else {
      filteredServices.forEach(s => {
        select.innerHTML += `<option value="${s.name}">${s.name}</option>`;
      });
    }

    document.getElementById("resourceModal").style.display = "block";
  } catch (err) {
    console.error("Error:", err);
  }
}

function closeModal() {
  document.getElementById("resourceModal").style.display = "none";
}

async function confirmDispatch() {
  const resourceName = document.getElementById("resourceSelect").value;
  if (!resourceName) return alert("Select a resource first!");

  try {
    const res = await fetch("http://localhost:5000/assign-resource", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sosId: selectedSosId,
        resourceName: resourceName
      })
    });

    const data = await res.json();
    if (data.success) {
      alert(`Success! ${resourceName} has been dispatched.`);
      closeModal();
      loadSOS();
    }
  } catch (err) {
    alert("Server error during dispatch.");
  }
}

loadSOS();
setInterval(loadSOS, 5000);