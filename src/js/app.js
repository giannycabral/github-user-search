// app.js

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search-btn");
  const usernameInput = document.getElementById("username");
  const resultDiv = document.getElementById("result");
  const octocat = document.querySelector(".octocat");

  // Função para exibir a mensagem de boas-vindas
  function displayWelcomeMessage() {
    resultDiv.innerHTML = `
      <div class="welcome-message">
        <div class="welcome-icon">
          <i class="fab fa-github"></i>
        </div>
        <h3>✨ Bem-vindo ao Pesquisador de Perfis GitHub! ✨</h3>
        <p>Digite um nome de usuário do GitHub acima e clique em "Pesquisar" para descobrir:</p>
        <ul>
          <li>🔍 Detalhes do perfil</li>
          <li>📚 Número de repositórios</li>
          <li>👥 Seguidores e seguindo</li>
        </ul>
        <p class="welcome-tip">Dica: Clique no botão no canto superior esquerdo para alternar entre os temas claro e escuro!</p>
      </div>
    `;
  }

  // Exibir mensagem de boas-vindas ao carregar a página
  displayWelcomeMessage();

  // Criar balão de fala
  const speechBubble = document.createElement("div");
  speechBubble.className = "speech-bubble";
  document.querySelector(".octocat-container").appendChild(speechBubble);

  // Mensagens do Octocat
  const messages = [
    "Olá! Vamos procurar algum dev?",
    "Digite um nome de usuário!",
    "Eu posso ajudar você a encontrar!",
    "Vamos explorar o GitHub juntos!",
  ];

  // Função para mostrar mensagens automaticamente
  let currentMessageIndex = 0;

  function showNextMessage() {
    speechBubble.textContent = messages[currentMessageIndex];
    speechBubble.classList.add("visible");
    octocat.classList.add("waving");

    setTimeout(() => {
      speechBubble.classList.remove("visible");
      octocat.classList.remove("waving");

      currentMessageIndex = (currentMessageIndex + 1) % messages.length;

      setTimeout(() => {
        showNextMessage();
      }, 1000); // Tempo antes da próxima mensagem
    }, 3000); // Tempo que a mensagem fica visível
  }

  // Iniciar as mensagens automáticas após um pequeno delay
  setTimeout(() => {
    showNextMessage();
  }, 1000);

  // Manter o evento de hover para interação adicional
  octocat.addEventListener("mouseover", () => {
    octocat.style.transform = "scale(1.1) rotate(5deg)";
  });

  octocat.addEventListener("mouseout", () => {
    octocat.style.transform = "scale(1) rotate(0)";
  });    searchBtn.addEventListener("click", async () => {
    const username = usernameInput.value.trim();

    if (!username) {
      resultDiv.innerHTML =
        '<p class="error-message">Por favor, digite um nome de usuário</p>';
      octocat.classList.add("error");
      setTimeout(() => octocat.classList.remove("error"), 500);
      
      // Restaurar mensagem de boas-vindas após o erro
      setTimeout(() => {
        displayWelcomeMessage();
      }, 1500);
      return;
    }

    try {
      octocat.classList.add("walking");
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();

      if (response.ok) {
        // Criar elementos dinamicamente
        const userProfile = document.createElement("div");
        userProfile.className = "user-profile";

        // Construir o HTML do perfil
        userProfile.innerHTML = `
            <div class="profile-header">
                <img src="${data.avatar_url}" alt="${
          data.login
        }" class="profile-img">
                <div class="profile-info">
                    <h2>${data.name || data.login}</h2>
                    <p class="username">@${data.login}</p>
                    <p class="bio">${data.bio || "Sem biografia"}</p>
                </div>
            </div>

            <div class="stats">
                <div class="stat-item">
                    <div class="stat-value" id="repos">0</div>
                    <div class="stat-label">Repositórios</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="followers">0</div>
                    <div class="stat-label">Seguidores</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="following">0</div>
                    <div class="stat-label">Seguindo</div>
                </div>
            </div>

            <div class="social-links">
              <a href="https://github.com/${
                data.login
              }" target="_blank" class="profile-btn">
                <i class="fab fa-github"></i> Ver Perfil
              </a>
              <button class="share-btn" onclick="shareProfile('${
                data.login
              }')">
                <i class="fas fa-share-alt"></i> Compartilhar
              </button>
            </div>
        `;

        resultDiv.innerHTML = "";
        resultDiv.appendChild(userProfile);

        // Anima os números
        setTimeout(() => {
          animateNumber(document.getElementById("repos"), data.public_repos);
          animateNumber(document.getElementById("followers"), data.followers);
          animateNumber(document.getElementById("following"), data.following);
        }, 300);

        // Animações do Octocat
        octocat.classList.remove("walking");
        octocat.classList.add("jumping");
        speechBubble.textContent = "Encontrei! 🎉";
        speechBubble.classList.add("visible");
      } else {
        resultDiv.innerHTML =
          '<p class="error-message">Usuário não encontrado 😕</p>';
        octocat.classList.remove("walking");
        speechBubble.textContent = "Ops, não encontrei... 😕";
        speechBubble.classList.add("visible");
      }
    } catch (error) {
      resultDiv.innerHTML =
        '<p class="error-message">Erro ao buscar usuário</p>';
      octocat.classList.add("error");
    } finally {
      setTimeout(() => {
        octocat.classList.remove("jumping", "walking", "error");
        speechBubble.classList.remove("visible");
      }, 2000);
    }
  });

  // Permitir que o usuário pressione Enter para pesquisar
  usernameInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      searchBtn.click();
    }
  });

  // Adiciona interação ao hover
  octocat.addEventListener("mouseover", () => {
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    speechBubble.textContent = randomMessage;
    speechBubble.classList.add("visible");
    octocat.classList.add("waving");
    octocat.style.transform = "scale(1.1) rotate(5deg)";
  });

  octocat.addEventListener("mouseout", () => {
    speechBubble.classList.remove("visible");
    octocat.classList.remove("waving");
    octocat.style.transform = "scale(1) rotate(0)";
  });

  // Interação ao clicar
  octocat.addEventListener("click", () => {
    octocat.classList.remove("walking", "waving");
    octocat.classList.add("jumping");
    setTimeout(() => octocat.classList.remove("jumping"), 500);
  });

  // Removendo toda a lógica relacionada ao tema
  const currentTheme = "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  // Função para compartilhar perfil (movida para escopo global)
  window.shareProfile = function (username) {
    if (navigator.share) {
      navigator
        .share({
          title: "Perfil GitHub",
          text: `Confira o perfil de ${username} no GitHub!`,
          url: `https://github.com/${username}`,
        })
        .catch(console.error);
    } else {
      const url = `https://github.com/${username}`;
      navigator.clipboard.writeText(url);

      const shareBtn = document.querySelector(".share-btn");
      const originalText = shareBtn.innerHTML;
      shareBtn.innerHTML = '<i class="fas fa-check"></i> URL Copiada!';

      setTimeout(() => {
        shareBtn.innerHTML = originalText;
      }, 2000);
    }
  };

  // Função para animar números
  function animateNumber(element, final) {
    if (!element) return;

    let current = 0;
    const duration = 1500;
    const frames = 60;
    const step = final / frames;

    function update() {
      if (current < final) {
        current = Math.min(current + step, final);
        element.textContent = Math.round(current).toLocaleString();
        requestAnimationFrame(update);
      }
    }

    update();
  }
});

// Atualizar texto do botão de tema
function updateThemeButton(theme) {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return; // Evita erro se o elemento não existir
  
  const icon = theme === "light" ? "fa-moon" : "fa-sun";
  const text = theme === "light" ? "Modo Escuro" : "Modo Claro";

  themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
  themeToggle.setAttribute("data-mode", text);
}

// Atualizar ao carregar e ao mudar o tema
document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  updateThemeButton(currentTheme);

  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme");
      const newTheme = currentTheme === "light" ? "dark" : "light";
      
      // Salvar tema no localStorage
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      updateThemeButton(newTheme);
    });
  }
});
