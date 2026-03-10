/* ========================= */
/* CONFIGURAÇÃO DO JOGO */
/* ========================= */

let currentCourse = localStorage.getItem("course") || "logic";

const TOTAL_PHASES = 3;
const QUESTIONS_PER_PHASE = 50;

function getToday(){
  return new Date().toISOString().split("T")[0];
}

let today = getToday();
let todayQuestions = [];

/* ========================= */
/* NOME DA CRIANÇA */
/* ========================= */

let childName = localStorage.getItem("childName");

function askChildName(){

  if(childName) return;

  const box = document.createElement("div");
  box.className = "name-box";

  box.innerHTML = `
  <div class="name-card">
    <h2>👋 Olá pequeno programador!</h2>
    <p>Como você se chama?</p>
    <input id="nameInput" placeholder="Digite seu nome" maxlength="15"/>
    <button onclick="saveChildName()">Começar 🚀</button>
  </div>
  `;

  document.body.appendChild(box);

  setTimeout(()=>{
    document.getElementById("nameInput").focus();
  },200)

}

function saveChildName(){

  const input = document.getElementById("nameInput");
  let name = input.value.trim();

  if(name === ""){
    name = "Mini Dev";
  }

  childName = name;

  localStorage.setItem("childName", name);

  document.querySelector(".name-box").remove();

}

/* ========================= */
/* CURSOS */
/* ========================= */

function getCourseName(course){

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

function initProgress(course){

  const key = `logicakids_progress_${course}`;

  if(!localStorage.getItem(key)){

    localStorage.setItem(key, JSON.stringify({
      startDate: today,
      currentPhase: 1,
      currentQuestion: 0,
      xp: 0
    }));

  }

}

initProgress(currentCourse);

const STORAGE_KEY = `logicakids_progress_${currentCourse}`;

let progress = JSON.parse(localStorage.getItem(STORAGE_KEY));

/* ========================= */
/* GERAR PERGUNTA */
/* ========================= */

function generateQuestion(){

  if(!questionBank || !questionBank[currentCourse]) return;

  const phaseQuestions = questionBank[currentCourse][progress.currentPhase];

  if(!phaseQuestions || phaseQuestions.length === 0) return;

  if(todayQuestions.length === 0){

    let shuffled = [...phaseQuestions];

    shuffled.sort(()=> Math.random() - 0.5);

    const limit = Math.min(QUESTIONS_PER_PHASE, shuffled.length);

    todayQuestions = shuffled.slice(0, limit);

  }

  const question = todayQuestions[progress.currentQuestion];

  if(!question) return;

  return shuffleQuestion(question);

}

/* ========================= */
/* STATUS */
/* ========================= */

function updateStatus(){

  const level = Math.floor(progress.xp / 50) + 1;

  const xpEl = document.getElementById("xp");
  const levelEl = document.getElementById("level");

  if(xpEl) xpEl.innerText = progress.xp;
  if(levelEl) levelEl.innerText = level;

}

/* ========================= */
/* BARRA DE PROGRESSO */
/* ========================= */

function updateProgressBar(){

  const phaseQuestions = questionBank[currentCourse][progress.currentPhase];

  if(!phaseQuestions || phaseQuestions.length === 0) return;

  const phaseLimit = Math.min(QUESTIONS_PER_PHASE, phaseQuestions.length);

  const percent = (progress.currentQuestion / phaseLimit) * 100;

  const bar = document.getElementById("progressFill");

  if(bar){
    bar.style.width = percent + "%";
  }

}

/* ========================= */
/* CARREGAR MISSÃO */
/* ========================= */

function loadMission(){

  const phaseQuestions = questionBank[currentCourse][progress.currentPhase];

  if(progress.currentPhase > TOTAL_PHASES){

    document.getElementById("mission").innerHTML = `
      <h2>🏆 Parabéns ${childName}!</h2>
      <p>Você terminou o curso de ${getCourseName(currentCourse)}</p>
      <button onclick="baixarCertificadoFinal()">📜 Baixar Conquista</button>
    `;

    return;

  }

  if(!phaseQuestions || phaseQuestions.length === 0){

    progress.currentPhase++;

    progress.currentQuestion = 0;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

    loadMission();

    return;

  }

  const phaseLimit = Math.min(QUESTIONS_PER_PHASE, phaseQuestions.length);

  if(progress.currentQuestion >= phaseLimit){

    document.getElementById("mission").innerHTML = `
      <h2>🎉 Fase ${progress.currentPhase} Concluída!</h2>
      <div class =" btnfinalizarFase">
        <button onclick="copyDayMessage()">Compartilhar Conquista</button>
        <button onclick="finalizarFase()">Continuar 🚀</button>
      </div>
    `;

    return;

  }

  const q = generateQuestion();

  if(!q) return;

  let html = `
    <p>🎮 ${getCourseName(currentCourse)} • Fase ${progress.currentPhase}</p>
    <div class="status">
        ⭐ XP: <span id="xp">${progress.xp}</span> |
        🏆 Nível: <span id="level">${Math.floor(progress.xp / 50) + 1}</span>
    </div>
    <div class="progress-bar">
       <div class="progress-fill" id="progressFill"></div>
    </div>
    <p class="progress-text">
      Pergunta ${progress.currentQuestion + 1} de ${phaseLimit}
    </p>
    <h3 class="question">${q.question}</h3>
  `;

  q.options.forEach((opt,index)=>{
    html += `
      <div class="option" onclick="selectOption(${index},${q.correct})">
        ${opt}
      </div>
    `;
  });

  document.getElementById("mission").innerHTML = html;

  updateProgressBar();

}

/* ========================= */
/* RESPOSTA */
/* ========================= */

function selectOption(index, correct){

  const options = document.querySelectorAll(".option");

  const selected = options[index];

  if(index !== correct){

    selected.classList.add("wrong");

    showToast("😅 Quase! Vamos tentar outra!", "error");

    const wrongQuestion = todayQuestions[progress.currentQuestion];

    todayQuestions.splice(progress.currentQuestion,1);

    todayQuestions.push(wrongQuestion);

    setTimeout(()=>{
      loadMission();
    },700);

    return;

  }

  selected.classList.add("correct");

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 }
  });

  progress.xp += 10;

  progress.currentQuestion++;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  updateStatus();

  updateProgressBar();

  showToast("🎉 Muito bem! +10 XP!", "success");

  setTimeout(()=>{
    loadMission();
  },700);

}

/* ========================= */
/* FINALIZAR FASE */
/* ========================= */

function finalizarFase(){

  const phaseQuestions = questionBank[currentCourse][progress.currentPhase];

  if(!phaseQuestions || phaseQuestions.length === 0){

    progress.currentPhase++;

    progress.currentQuestion = 0;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

    loadMission();

    return;

  }

  const phaseLimit = Math.min(QUESTIONS_PER_PHASE, phaseQuestions.length);

  if(progress.currentQuestion < phaseLimit){

    showToast(`⚠️ Responda todas as perguntas primeiro!`, "error");

    return;

  }

  if(progress.currentPhase === TOTAL_PHASES){
    finalizarCurso();
    return;
  }

  progress.currentPhase++;

  progress.currentQuestion = 0;

  todayQuestions = [];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  showToast("🚀 Nova fase desbloqueada!", "success");

  setTimeout(()=>{
    loadMission();
  },500);

}

/* ========================= */
/* COMPARTILHAR CONQUISTA */
/* ========================= */

function copyDayMessage(){

  const level = Math.floor(progress.xp / 50) + 1;

  const text =
`🏆════════════════════════🏆
👨‍💻 ${childName} concluiu a Fase ${progress.currentPhase}
📚 Curso: ${getCourseName(currentCourse)}
⭐ XP Total: ${progress.xp}
🏅 Nível Atual: ${level}
🚀 LogicaKids - Programação para pequenos gênios!
`;

  navigator.clipboard.writeText(text);

  showToast("📋 Conquista copiada!", "success");

}

/* ========================= */
/* CERTIFICADO FINAL */
/* ========================= */

function gerarCertificadoFinal(){

  const cert = document.getElementById("certificado");

  if(!cert) return;

  const level = Math.floor(progress.xp / 50) + 1;

  const courseName = getCourseName(currentCourse);

  document.getElementById("cert-nome").innerText = childName;
  document.getElementById("cert-curso").innerText = courseName;
  document.getElementById("cert-nivel").innerText = level;
  document.getElementById("cert-xp").innerText = progress.xp;

  cert.style.display = "block";

  html2canvas(cert).then(canvas=>{

    const link = document.createElement("a");

    link.download = `Conquista-${courseName}.png`;

    link.href = canvas.toDataURL();

    link.click();

    cert.style.display = "none";

  });

}

/* ========================= */
/* FINALIZAR CURSO */
/* ========================= */

function finalizarCurso(){

  progress.currentPhase = TOTAL_PHASES + 1;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));

  showToast("🏆 Curso concluído! Baixe sua Conquista 📜", "success");

  loadMission();

}

/* ========================= */
/* BAIXAR CERTIFICADO */
/* ========================= */

function baixarCertificadoFinal(){

  gerarCertificadoFinal();

  unlockNextCourse(currentCourse);

  setTimeout(()=>{
    window.location.href = "../../index.html";
  },2000);

}

/* ========================= */
/* DESBLOQUEAR CURSO */
/* ========================= */

function unlockNextCourse(course){

  const courses = ["logic","html","css","javascript","ai"];

  const index = courses.indexOf(course);

  if(index === -1 || index === courses.length -1) return;

  const nextCourse = courses[index + 1];

  const nextKey = `logicakids_progress_${nextCourse}`;

  if(!localStorage.getItem(nextKey)){

    localStorage.setItem(nextKey, JSON.stringify({
      startDate: getToday(),
      currentPhase: 1,
      currentQuestion: 0,
      xp: 0
    }));

  }

}

/* ========================= */
/* EMBARALHAR RESPOSTAS */
/* ========================= */

function shuffleQuestion(question){

  let options = [...question.options];

  let correctAnswer = options[question.correct];

  for(let i = options.length -1; i > 0; i--){

    const j = Math.floor(Math.random()*(i+1));

    [options[i],options[j]]=[options[j],options[i]];

  }

  const newCorrect = options.indexOf(correctAnswer);

  return {
    question: question.question,
    options: options,
    correct: newCorrect
  };

}

/* ========================= */
/* TOAST */
/* ========================= */

function showToast(message,type){

  const toast = document.createElement("div");

  toast.classList.add("toast");

  if(type) toast.classList.add(type);

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(()=> toast.classList.add("show"),100);

  setTimeout(()=>{

    toast.classList.remove("show");

    setTimeout(()=>{

      document.body.removeChild(toast);

    },400);

  },2000);

}

/* ========================= */
/* INICIAR */
/* ========================= */

askChildName();

updateStatus();

loadMission();