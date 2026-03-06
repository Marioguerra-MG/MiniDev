/* ========================= */
/* CONFIGURAÇÃO DO JOGO */
/* ========================= */

let currentCourse = localStorage.getItem("course") || "logic";

const TOTAL_DAYS = 15;
const QUESTIONS_PER_DAY = 10;

function getToday() {
  return new Date().toISOString().split("T")[0];
}

let today = getToday();
let todayQuestions = [];

/* ========================= */
/* NOME DA CRIANÇA */
/* ========================= */

let childName = localStorage.getItem("childName");

function askChildName() {

  if (childName) return;

  const box = document.createElement("div");

  box.className = "name-box";

  box.innerHTML = `

  <div class="name-card">

  <h2>👋 Olá pequeno programador!</h2>

  <p>Como você se chama?</p>

  <input 
  id="nameInput"
  placeholder="Digite seu nome"
  maxlength="15"
  />

  <button onclick="saveChildName()">Começar 🚀</button>

  </div>

  `;

  document.body.appendChild(box);

  setTimeout(()=>{
    document.getElementById("nameInput").focus();
  },200)
}

function saveChildName() {

  const input = document.getElementById("nameInput");

  let name = input.value.trim();

  if (name === "") {
    name = "Mini Dev";
  }

  childName = name;

  localStorage.setItem("childName", name);

  document.querySelector(".name-box").remove();

}

/* ========================= */
/* CURSOS */
/* ========================= */

function getCourseName(course) {

  const courses = {
    logic: "Lógica de Programação",
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    ai: "Inteligência Artificial 🤖"
  };

  return courses[course] || course;

}

/* ========================= */
/* PROGRESSO */
/* ========================= */

const STORAGE_KEY = `logicakids_progress_${currentCourse}`;

let progress = JSON.parse(localStorage.getItem(STORAGE_KEY));

if (!progress) {

  progress = {
    startDate: today,
    lastPlayedDate: today,
    currentDay: 1,
    currentQuestion: 0,
    xp: 0,
    dayCompleted: false
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/* ========================= */
/* BLOQUEIO DE DIA */
/* ========================= */

function checkDayAccess() {

  const todayDate = getToday();

  if (
    progress.lastPlayedDate === todayDate &&
    progress.currentQuestion === 0 &&
    progress.dayCompleted === true
  ) {

    document.getElementById("mission").innerHTML = `
      <h2>⏳ Missões de hoje concluídas!</h2>
      <p>Volte amanhã para continuar 🚀</p>
    `;

    return false;
  }

  return true;
}

/* ========================= */
/* GERAR PERGUNTA */
/* ========================= */

function generateQuestion() {

  if (!questionBank || !questionBank[currentCourse]) {

    document.getElementById("mission").innerHTML =
      "⚠️ Perguntas ainda não carregadas!";

    return;

  }

  let difficulty;

  if (progress.currentDay <= 5) difficulty = "easy";
  else if (progress.currentDay <= 10) difficulty = "medium";
  else difficulty = "hard";

  const questions = questionBank[currentCourse][difficulty];

  if (todayQuestions.length === 0) {

    let shuffled = [...questions];

    for (let i = shuffled.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];

    }

    todayQuestions = shuffled.slice(0, QUESTIONS_PER_DAY);

  }

  return shuffleQuestion(todayQuestions[progress.currentQuestion]);

}

/* ========================= */
/* STATUS */
/* ========================= */

function updateStatus() {

  const level = Math.floor(progress.xp / 50) + 1;

  const xpEl = document.getElementById("xp");
  const levelEl = document.getElementById("level");

  if (xpEl) xpEl.innerText = progress.xp;
  if (levelEl) levelEl.innerText = level;

}

/* ========================= */
/* CARREGAR MISSÃO */
/* ========================= */

function loadMission() {

  if (!checkDayAccess()) return;

  if (progress.currentDay > TOTAL_DAYS) {

    document.getElementById("mission").innerHTML = `
    
    <h2>🏆 Parabéns ${childName}!</h2>
    
    <p>Você terminou o curso de ${getCourseName(currentCourse)}</p>
    
    <button onclick="gerarCertificadoFinal()">📜 Baixar Certificado</button>
    
    `;

    return;
  }

  if (progress.currentQuestion >= QUESTIONS_PER_DAY) {

    document.getElementById("mission").innerHTML = `

      <h2>🎉 Dia ${progress.currentDay} Concluído!</h2>

      <button onclick="copyDayMessage()">Compartilhar Conquista</button>

      <button onclick="finalizarDia()">Continuar 🚀</button>

    `;

    return;
  }

  const q = generateQuestion();

  if (!q) return;

  let html = `
  
  <h3>📅 Dia ${progress.currentDay} - Pergunta ${progress.currentQuestion + 1}</h3>

  <p class="question">${q.question}</p>
  
  `;

  q.options.forEach((opt, index) => {

    html += `

    <div class="option" onclick="selectOption(${index}, ${q.correct})">
    
    ${opt}
    
    </div>
    
    `;

  });

  document.getElementById("mission").innerHTML = html;

}

/* ========================= */
/* RESPOSTA */
/* ========================= */

function selectOption(index, correct) {

  if (index !== correct) {

    showToast("😅 Quase! Tente novamente!", "error");

    return;
  }

  progress.xp += 10;
  progress.currentQuestion++;

  showToast("🎉 Muito bem! +10 XP!", "success");

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  updateStatus();

  setTimeout(() => {

    loadMission();

  }, 900);

}

/* ========================= */
/* FINALIZAR DIA */
/* ========================= */

function finalizarDia() {

  if (progress.currentQuestion < QUESTIONS_PER_DAY) {

    showToast("⚠️ Responda as 10 perguntas primeiro!", "error");

    return;

  }

  progress.lastPlayedDate = getToday();
  progress.dayCompleted = true;

  progress.currentDay++;
  progress.currentQuestion = 0;

  todayQuestions = [];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  setTimeout(loadMission, 600);

}

/* ========================= */
/* COMPARTILHAR CONQUISTA */
/* ========================= */

function copyDayMessage(){

const level = Math.floor(progress.xp / 50) + 1;

const text = 
`🏆════════════════════════════🏆
          CERTIFICADO KIDS
🏆════════════════════════════🏆

👨‍💻 *${childName}*

concluiu com sucesso o

📚 *Dia ${progress.currentDay}*
do curso

🎓 *${getCourseName(currentCourse)}*

⭐ XP Total: ${progress.xp}
🏅 Nível Atual: ${level}

🚀 LogicaKids
Programação para pequenos gênios!

👏 Parabéns pequeno programador!

🏆════════════════════════════🏆`;

navigator.clipboard.writeText(text);

showToast("📋 Certificado copiado! Compartilhe no WhatsApp!", "success");

}

/* ========================= */
/* CERTIFICADO FINAL */
/* ========================= */

function gerarCertificadoFinal() {

  const cert = document.getElementById("certificado");

  if (!cert) return;

  const level = Math.floor(progress.xp / 50) + 1;

  const courseName = getCourseName(currentCourse);

  document.getElementById("cert-nome").innerText = childName;
  document.getElementById("cert-curso").innerText = courseName;
  document.getElementById("cert-nivel").innerText = level;
  document.getElementById("cert-xp").innerText = progress.xp;

  cert.style.display = "block";

  html2canvas(cert).then(canvas => {

    const link = document.createElement("a");

    link.download = `certificado-${courseName}.png`;

    link.href = canvas.toDataURL();

    link.click();

    cert.style.display = "none";

  });

}

/* ========================= */
/* EMBARALHAR RESPOSTAS */
/* ========================= */

function shuffleQuestion(question) {

  let options = [...question.options];

  let correctAnswer = options[question.correct];

  for (let i = options.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [options[i], options[j]] = [options[j], options[i]];

  }

  const newCorrect = options.indexOf(correctAnswer);

  return {
    question: question.question,
    options: options,
    correct: newCorrect
  };

}

/* ========================= */
/* TROCAR CURSO */
/* ========================= */

function selectCourse(course) {

  localStorage.setItem("course", course);

  location.reload();

}

/* ========================= */
/* TOAST */
/* ========================= */

function showToast(message, type) {

  const toast = document.createElement("div");

  toast.classList.add("toast");

  if (type) toast.classList.add(type);

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 100);

  setTimeout(() => {

    toast.classList.remove("show");

    setTimeout(() => {

      document.body.removeChild(toast);

    }, 400);

  }, 2000);

}

/* ========================= */
/* INICIAR */
/* ========================= */

askChildName();

updateStatus();

loadMission();