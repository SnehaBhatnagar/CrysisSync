// ✅ LOCATION FUNCTION
async function getLocation() {
  navigator.geolocation.getCurrentPosition(async function(position) {

    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      const data = await res.json();

      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "Unknown";

      document.getElementById("location").value = city;

    } catch (err) {
      console.log(err);
      alert("Error getting location");
    }

  });
}


// ✅ SEND SOS FUNCTION
async function sendSOS() {
  const emergency = document.getElementById("type").value;
  const location = document.getElementById("location").value;
  const description = document.getElementById("description").value;

  console.log("Sending:", emergency, location, description);

  try {
    const res = await fetch("http://localhost:5000/sos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        emergency,
        location,
        description
      })
    });

    const data = await res.json();

    if (data.success) {
  alert("🚑 Help will reach you soon!");

  window.location.href = "index.html";
}
  } catch (err) {
    console.log(err);
    document.getElementById("message").innerText = "Server error";
  }
}