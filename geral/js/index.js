/* ========================= */
/* ABRIR CURSOS */
/* ========================= */

function openCourses() {
    document.getElementById("courses").style.display = "block";
}

/* ========================= */
/* IR PARA PÁGINA */
/* ========================= */

function goToPage(page) {
    document.getElementById("loader").style.display = "flex";
    setTimeout(() => {
        window.location.href = page;
    }, 1000);
}

/* ========================= */
/* TOAST */
/* ========================= */

function showToast(message, type = "info"){
    const toast = document.createElement("div");
    toast.className = "toast " + type;
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(()=>{ toast.classList.add("show"); },100);

    setTimeout(()=>{
        toast.classList.remove("show");
        setTimeout(()=>{ toast.remove(); },400);
    },2500);
}

/* ========================= */
/* CURSOS LIBERADOS */
/* ========================= */

function isCourseUnlocked(course){
    if(course === "logic") return true;

    const logic = JSON.parse(localStorage.getItem("logicakids_progress_logic")) || {currentPhase:0};
    const html = JSON.parse(localStorage.getItem("logicakids_progress_html")) || {currentPhase:0};
    const css = JSON.parse(localStorage.getItem("logicakids_progress_css")) || {currentPhase:0};
    const js = JSON.parse(localStorage.getItem("logicakids_progress_javascript")) || {currentPhase:0};
    const ai = JSON.parse(localStorage.getItem("logicakids_progress_ai")) || {currentPhase:0};

    // Critério de desbloqueio: curso anterior **finalizado** (currentPhase > TOTAL_PHASES)
    const TOTAL_PHASES = 3; 

    if(course === "html") return logic.currentPhase > TOTAL_PHASES;
    if(course === "css") return html.currentPhase > TOTAL_PHASES;
    if(course === "javascript") return css.currentPhase > TOTAL_PHASES;
    if(course === "ai") return js.currentPhase > TOTAL_PHASES;

    return false;
}
/* ========================= */
/* INICIAR CURSO */
/* ========================= */

function startCourse(course){
    if(!isCourseUnlocked(course)){
        showToast("🔒 Termine o curso anterior primeiro!", "error");
        return;
    }
    localStorage.setItem("course", course);
    goToPage("/geral/levels/logicakids.html");
}

/* ========================= */
/* ATUALIZAR BOTÕES */
/* ========================= */

function updateCourseLocks(){
    const buttons = document.querySelectorAll(".courses button");
    buttons.forEach(btn => {
        const course = btn.getAttribute("onclick").match(/'(.*?)'/)[1];
        if(!isCourseUnlocked(course)){
            btn.innerHTML = "🔒 " + btn.innerText;
            btn.style.opacity = "0.6";
        } else {
            btn.innerHTML = btn.innerText.replace("🔒 ", "");
            btn.style.opacity = "1";
        }
    });
}

updateCourseLocks();