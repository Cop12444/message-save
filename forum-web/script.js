// Gestion inscription et connexion avec sauvegarde des utilisateurs en localStorage

let isSignup = false;
let users = JSON.parse(localStorage.getItem("forumUsers")) || {};
let currentUser = null;

const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const switchAuth = document.getElementById("switch-auth");
const toggleAuth = document.getElementById("toggle-auth");
const forumSection = document.getElementById("forum-section");
const authSection = document.getElementById("auth-section");
const userDisplay = document.getElementById("user-display");
const logout = document.getElementById("logout");
const messageForm = document.getElementById("messageForm");
const messagesDiv = document.getElementById("messages");

// Basculer entre connexion / inscription
switchAuth.addEventListener("click", (e) => {
  e.preventDefault();
  isSignup = !isSignup;
  authTitle.innerText = isSignup ? "Inscription" : "Connexion";
  switchAuth.innerText = isSignup ? "Se connecter" : "S'inscrire";
  toggleAuth.innerHTML = isSignup
    ? "Déjà un compte ? <a href='#' id='switch-auth'>Se connecter</a>"
    : "Pas encore de compte ? <a href='#' id='switch-auth'>S'inscrire</a>";
});

// Connexion ou inscription
authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (isSignup) {
    if (users[username]) {
      alert("Ce nom d'utilisateur existe déjà.");
      return;
    }
    users[username] = password;
    localStorage.setItem("forumUsers", JSON.stringify(users));
    alert("Inscription réussie ! Connectez-vous.");
    isSignup = false;
    authTitle.innerText = "Connexion";
  } else {
    if (!users[username] || users[username] !== password) {
      alert("Identifiants incorrects.");
      return;
    }
    currentUser = username;
    authSection.style.display = "none";
    forumSection.style.display = "block";
    userDisplay.innerText = username;
    loadMessages();
  }
});

// Déconnexion
logout.addEventListener("click", (e) => {
  e.preventDefault();
  currentUser = null;
  forumSection.style.display = "none";
  authSection.style.display = "block";
});

// Envoi de message
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const toUser = document.getElementById("toUser").value;
  const msg = document.getElementById("message").value;

  if (!users[toUser]) {
    alert("Ce destinataire n'existe pas.");
    return;
  }

  const messages = JSON.parse(localStorage.getItem("forumMessages") || "[]");
  const encrypted = btoa(`${msg}`); // simple encodage base64 (à améliorer)

  messages.push({
    from: currentUser,
    to: toUser,
    msg: encrypted,
    timestamp: Date.now(),
  });
  localStorage.setItem("forumMessages", JSON.stringify(messages));

  alert("Message envoyé à " + toUser);
  document.getElementById("message").value = "";
});

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem("forumMessages") || "[]");
  messagesDiv.innerHTML = "";
  messages
    .filter((m) => m.to === currentUser)
    .forEach((m, i) => {
      const msgEl = document.createElement("div");
      msgEl.innerHTML = `<strong>${m.from}</strong> vous a envoyé un message : <input type="password" id="pass${i}" placeholder="Mot de passe"> <button onclick="decrypt(${i}, '${m.msg}')">Voir</button> <span id="msg${i}"></span>`;
      messagesDiv.appendChild(msgEl);
    });
}

function decrypt(index, msg) {
  const passInput = document.getElementById("pass" + index);
  const enteredPass = passInput.value;
  const savedPass = users[currentUser];
  if (enteredPass === savedPass) {
    document.getElementById("msg" + index).innerText = atob(msg);
    setTimeout(() => {
      document.getElementById("msg" + index).innerText = "(supprimé)";
    }, 10000);
  } else {
    alert("Mot de passe incorrect !");
  }
}
