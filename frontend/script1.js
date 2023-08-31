  //Register

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");
  
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const name = document.getElementById("registerName").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
  
      if (password !== confirmPassword) {
        alert("As senhas não conferem!");
        return;
      }
  
      const userData = {
        'name': name,
        'email': email,
        'password': password,
        'confirmpassword': confirmPassword
      };
  
      try {
        const response = await fetch("/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Cadastro realizado com sucesso!");
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
      }
    });
  });
  

  // Login

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
  
      const loginData = {
        email,
        password,
      };
  
      try {
        const response = await fetch("/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert(data.msg);
          
          // Armazena o token no localStorage
          localStorage.setItem("jwtToken", data.token);
          
          // Redireciona o usuário para a rota protegida
          const userId = data.id;
          window.location.href = `/profile?id=${userId}`;
        } else {
          alert(data.msg);
        }
      } catch (error) {
        console.error("Erro ao fazer login:", error);
      }
    });
  });