const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  if (!name || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, password })
    });

    const data = await res.json();

    if (data.success) {
      alert("Login successful");
      window.location.href = "staff.html";
    } else {
      alert("Invalid login");
    }

  } catch (error) {
    alert("Server error");
  }
});