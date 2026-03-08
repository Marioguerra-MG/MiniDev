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
    const loader = document.getElementById("loader");
    if(loader){
        loader.style.display = "flex";
    }

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
/* DATA */
/* ========================= */

function getToday(){

    const today = new Date();

    return today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();

}

/* ========================= */
/* PROGRESSO */
/* ========================= */

function getProgress(course){

    return JSON.parse(
        localStorage.getItem("logicakids_progress_" + course)
    ) || {currentPhase:0};

}

/* ========================= */
/* CURSO TERMINADO */
/* ========================= */

function isCourseFinished(course){

    const TOTAL_PHASES = 3;

    return getProgress(course).currentPhase > TOTAL_PHASES;

}

/* ========================= */
/* ORDEM DOS CURSOS */
/* ========================= */

const courseOrder = [
    "logic",
    "html",
    "css",
    "javascript",
    "ai"
];

/* ========================= */
/* NOMES DOS CURSOS */
/* ========================= */

const courseNames = {

    logic: "Lógica",
    html: "HTML",
    css: "CSS",
    javascript: "JavaScript",
    ai: "IA"

};

/* ========================= */
/* TODOS CURSOS TERMINADOS */
/* ========================= */

function areAllCoursesFinished(){

    for(let course of courseOrder){

        if(!isCourseFinished(course)){
            return false;
        }

    }

    return true;

}

/* ========================= */
/* PEGAR PRÓXIMO CURSO */
/* ========================= */

function getNextCourse(){

    for(let course of courseOrder){

        if(!isCourseFinished(course)){
            return course;
        }

    }

    return null;

}

/* ========================= */
/* INICIAR CURSO */
/* ========================= */

function startCourse(course){

    const today = getToday();
    const savedDay = localStorage.getItem("course_day");
    const savedCourse = localStorage.getItem("course");

    /* se todos cursos terminados */

    if(areAllCoursesFinished()){

        const certButton = document.getElementById("certificado");

        if(certButton){
            certButton.style.display = "block";
        }

        showToast("🏆 Todos os cursos concluídos!", "info");
        return;
    }

    /* curso já concluído */

    if(isCourseFinished(course)){

        showToast("✅ Curso já concluído!", "info");
        return;

    }

    /* já iniciou curso hoje */

    if(savedDay === today){

        if(savedCourse === course){

            goToPage("/geral/levels/logicakids.html");
            return;

        }

        showToast("⏳ Você já fez o curso de hoje!", "error");
        return;

    }

    /* verificar ordem */

    const nextCourse = getNextCourse();

    if(course !== nextCourse){

        showToast("🔒 Curso ainda bloqueado!", "error");
        return;

    }

    /* salvar curso do dia */

    localStorage.setItem("course", course);
    localStorage.setItem("course_day", today);

    goToPage("/geral/levels/logicakids.html");

}

/* ========================= */
/* ATUALIZAR BOTÕES */
/* ========================= */

function updateCourseLocks(){

    const buttons = document.querySelectorAll(".courses button");

    if(!buttons.length) return;

    const today = getToday();
    const savedDay = localStorage.getItem("course_day");
    const savedCourse = localStorage.getItem("course");

    const nextCourse = getNextCourse();
    const allFinished = areAllCoursesFinished();

    buttons.forEach(btn => {

        const onclickAttr = btn.getAttribute("onclick");

        if(!onclickAttr) return;

        const match = onclickAttr.match(/'(.*?)'/);

        if(!match) return;

        const course = match[1];
        const name = courseNames[course];

        /* TODOS TERMINADOS */

        if(allFinished){

            btn.innerHTML = "⭐ " + name;
            btn.style.opacity = "1";
            return;

        }

        /* CURSO CONCLUÍDO */

        if(isCourseFinished(course)){

            btn.innerHTML = "✔ " + name;
            btn.style.opacity = "0.7";
            return;

        }

        /* CURSO DO DIA */

        if(savedDay === today && savedCourse === course){

            btn.innerHTML = "▶️ " + name;
            btn.style.opacity = "1";
            return;

        }

        /* PRÓXIMO CURSO */

        if(course === nextCourse && savedDay !== today){

            btn.innerHTML = "▶️ " + name;
            btn.style.opacity = "1";
            return;

        }

        /* BLOQUEADO */

        btn.innerHTML = "🔒 " + name;
        btn.style.opacity = "0.4";

    });

}

/* ========================= */
/* INICIAR */
/* ========================= */

document.addEventListener("DOMContentLoaded", function(){

    updateCourseLocks();

});