document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    const jwtToken = localStorage.getItem("jwtToken");
  
    try {
      const response = await fetch(`/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        const nomeElement = document.getElementById("nome");
        const emailElement = document.getElementById("email");
  
        nomeElement.textContent = `Nome: ${userData.user.name}`;
        emailElement.textContent = `Email: ${userData.user.email}`;
      } else {
        alert("Não autorizado ou erro ao acessar a rota protegida");
      }
    } catch (error) {
      console.error("Erro ao acessar a rota protegida:", error);
    }
  });