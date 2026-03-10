/* ========================= */
/* LINK PAGAMENTO */
/* ========================= */
const PAYMENT_LINK = "https://pay.kiwify.com.br/l5DBBlX";


/* ========================= */
/* ABRIR CURSOS */
/* ========================= */
function openCourses(){
    const courses = document.getElementById("courses");
    if(courses) courses.style.display = "block";
}


/* ========================= */
/* IR PARA PÁGINA */
/* ========================= */
function goToPage(page){
    const loader = document.getElementById("loader");
    if(loader) loader.style.display = "flex";

    setTimeout(()=>{
        window.location.href = page;
    },1000);
}


/* ========================= */
/* TOAST */
/* ========================= */
function showToast(message, type="info"){
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
    return JSON.parse(localStorage.getItem("logicakids_progress_"+course)) || {currentPhase:0, xp:0};
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
const courseOrder = ["logic","html","css","javascript","ai"];


/* ========================= */
/* NOMES DOS CURSOS */
/* ========================= */
const courseNames = {
    logic:"Lógica",
    html:"HTML",
    css:"CSS",
    javascript:"JavaScript",
    ai:"IA"
};


/* ========================= */
/* TODOS CURSOS TERMINADOS */
/* ========================= */
function areAllCoursesFinished(){
    return courseOrder.every(course => isCourseFinished(course));
}


/* ========================= */
/* PRÓXIMO CURSO DISPONÍVEL */
/* ========================= */
function getNextCourse(){
    return courseOrder.find(course => !isCourseFinished(course)) || null;
}


/* ========================= */
/* GERAR CERTIFICADO */
/* ========================= */
function generateCertificate(){
    const childName = localStorage.getItem("childName") || "Mini Dev";

    let totalXP = 0;
    courseOrder.forEach(course => {
        const progress = getProgress(course);
        totalXP += progress.xp || 0;
    });

    const level = Math.floor(totalXP / 50) + 1;

    // Pegar elementos do certificado
    const nomeEl = document.getElementById("cert-nome");
    const xpEl = document.getElementById("cert-xp");
    const nivelEl = document.getElementById("cert-nivel");
    const dataEl = document.getElementById("cert-data");
    const cert = document.getElementById("certificadoModelo");

    if(nomeEl) nomeEl.innerText = childName;
    if(xpEl) xpEl.innerText = totalXP;
    if(nivelEl) nivelEl.innerText = level;
    if(dataEl) dataEl.innerText = getDataCertificado();
    if(cert) cert.style.display = "block";

    // Gerar imagem
    html2canvas(cert).then(canvas => {
        const link = document.createElement("a");
        link.download = `Certificado-${childName}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        cert.style.display = "none";
    });
}


/* ========================= */
/* DATA DO CERTIFICADO */
/* ========================= */
function getDataCertificado(){
    const hoje = new Date();
    const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho",
                   "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
    return hoje.getDate() + " de " + meses[hoje.getMonth()] + " de " + hoje.getFullYear();
}


/* ========================= */
/* VERIFICAR CERTIFICADO */
/* ========================= */
function checkCertificate(){
    const certButton = document.getElementById("btnCertificado");
    if(!certButton) return;

    if(areAllCoursesFinished()){
        certButton.style.display = "block";

        certButton.onclick = function(e){
            e.preventDefault();

            const payment = localStorage.getItem("paymentApproved");
            const isPaid = payment === "true";

            if(isPaid){
                // Garantir que o modal esteja fechado
                const modal = document.getElementById("paymentModal");
                if(modal) modal.style.display = "none";

                generateCertificate();
                return;
            }

            showToast("💳 Libere o certificado primeiro","info");

            const modal = document.getElementById("paymentModal");
            if(modal) modal.style.display = "flex";
        };
    }
}


/* ========================= */
/* INICIAR CURSO */
/* ========================= */
function startCourse(course){
    const today = getToday();
    const savedDay = localStorage.getItem("course_day");
    const savedCourse = localStorage.getItem("course");

    if(areAllCoursesFinished()){
        checkCertificate();
        showToast("🏆 Todos os cursos concluídos!");
        return;
    }

    if(isCourseFinished(course)){
        showToast("✅ Curso já concluído!");
        return;
    }

    if(savedDay === today){
        if(savedCourse === course){
            goToPage("/geral/levels/logicakids.html");
            return;
        }
        showToast("⏳ Você já fez o curso hoje","error");
        return;
    }

    const nextCourse = getNextCourse();
    if(course !== nextCourse){
        showToast("🔒 Curso bloqueado","error");
        return;
    }

    localStorage.setItem("course", course);
    localStorage.setItem("course_day", today);

    goToPage("/geral/levels/logicakids.html");
}


/* ========================= */
/* ATUALIZAR BOTÕES DOS CURSOS */
/* ========================= */
function updateCourseLocks(){
    const buttons = document.querySelectorAll(".courses button");
    if(!buttons.length) return;

    const today = getToday();
    const savedDay = localStorage.getItem("course_day");
    const savedCourse = localStorage.getItem("course");
    const nextCourse = getNextCourse();
    const allFinished = areAllCoursesFinished();

    buttons.forEach(btn=>{
        const onclickAttr = btn.getAttribute("onclick");
        if(!onclickAttr) return;

        const match = onclickAttr.match(/'(.*?)'/);
        if(!match) return;

        const course = match[1];
        const name = courseNames[course];

        if(allFinished){
            btn.innerHTML = "✔ " + name;
            btn.style.opacity = "1";
            return;
        }

        if(isCourseFinished(course)){
            btn.innerHTML = "✔ " + name;
            btn.style.opacity = "0.7";
            return;
        }

        if(savedDay === today && savedCourse === course){
            btn.innerHTML = "▶️ " + name;
            btn.style.opacity = "1";
            return;
        }

        if(course === nextCourse && savedDay !== today){
            btn.innerHTML = "▶️ " + name;
            btn.style.opacity = "1";
            return;
        }

        btn.innerHTML = "🔒 " + name;
        btn.style.opacity = "0.4";
    });
}


/* ========================= */
/* INICIAR SISTEMA */
/* ========================= */
document.addEventListener("DOMContentLoaded", function(){
    updateCourseLocks();
    checkCertificate();
});