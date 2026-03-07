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

    setTimeout(()=>{
        toast.classList.add("show");
    },100);

    setTimeout(()=>{
        toast.classList.remove("show");

        setTimeout(()=>{
            toast.remove();
        },400);

    },2500);

}

/* ========================= */
/* CURSOS LIBERADOS */
/* ========================= */

/* ========================= */
/* CURSOS LIBERADOS */
/* ========================= */

function isCourseUnlocked(course){

    if(course === "logic") return true;

    const logic = JSON.parse(localStorage.getItem("logicakids_progress_logic"));
    const html = JSON.parse(localStorage.getItem("logicakids_progress_html"));
    const css = JSON.parse(localStorage.getItem("logicakids_progress_css"));
    const js = JSON.parse(localStorage.getItem("logicakids_progress_javascript"));

    const TOTAL_PHASES = 3;

    if(course === "html"){
        return logic && logic.currentPhase > TOTAL_PHASES;
    }

    if(course === "css"){
        return html && html.currentPhase > TOTAL_PHASES;
    }

    if(course === "javascript"){
        return css && css.currentPhase > TOTAL_PHASES;
    }

    if(course === "ai"){
        return js && js.currentPhase > TOTAL_PHASES;
    }

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

        }

    });

}

updateCourseLocks();