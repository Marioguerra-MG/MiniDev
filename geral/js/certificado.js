document.addEventListener("DOMContentLoaded", function () {

    const button = document.getElementById("btnCertificado");

    const courseOrder = ["logic", "html", "css", "javascript", "ai"];


    /* ========================= */
    /* PEGAR PROGRESSO */
    /* ========================= */

    function getProgress(course) {
        return JSON.parse(localStorage.getItem("logicakids_progress_" + course)) 
        || { currentPhase: 0, xp: 0 };
    }


    /* ========================= */
    /* VERIFICAR CURSO TERMINADO */
    /* ========================= */

    function isCourseFinished(course) {

        const TOTAL_PHASES = 3;

        return getProgress(course).currentPhase > TOTAL_PHASES;

    }


    /* ========================= */
    /* VERIFICAR CERTIFICADO */
    /* ========================= */

    function checkCertificate() {

        const finished = courseOrder.every(course => isCourseFinished(course));

        if (finished) {
            button.style.display = "inline-block";
        }

    }

    checkCertificate();


    /* ========================= */
    /* GERAR CERTIFICADO */
    /* ========================= */

    function generateCertificate() {

        /* NOME */

        const childName = localStorage.getItem("childName") || "Mini Dev";


        /* XP TOTAL */

        let totalXP = 0;

        courseOrder.forEach(course => {

            const progress = getProgress(course);

            totalXP += progress.xp || 0;

        });


        /* NÍVEL */

        const level = Math.floor(totalXP / 50) + 1;


        /* COLOCAR DADOS NO CERTIFICADO */

        const nomeEl = document.getElementById("cert-nome");
        const xpEl = document.getElementById("cert-xp");
        const nivelEl = document.getElementById("cert-nivel");
        const dataEl = document.getElementById("cert-data");

        if (nomeEl) nomeEl.innerText = childName;
        if (xpEl) xpEl.innerText = totalXP;
        if (nivelEl) nivelEl.innerText = level;

        if (dataEl) {
            dataEl.innerText = getDataCertificado();
        }


        /* MOSTRAR CERTIFICADO */

        const cert = document.getElementById("certificadoModelo");

        cert.style.display = "block";


        /* GERAR IMAGEM */

        html2canvas(cert).then(canvas => {

            const link = document.createElement("a");

            link.download = `Certificado-${childName}.png`;

            link.href = canvas.toDataURL("image/png");

            link.click();

            cert.style.display = "none";

        });

    }


    /* ========================= */
    /* BOTÃO CERTIFICADO */
    /* ========================= */

    if(button){
        button.addEventListener("click", generateCertificate);
    }


    /* ========================= */
    /* DATA AUTOMÁTICA */
    /* ========================= */

    function getDataCertificado() {

        const hoje = new Date();

        const dia = hoje.getDate();
        const ano = hoje.getFullYear();

        const meses = [
            "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
            "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
        ];

        const mes = meses[hoje.getMonth()];

        return dia + " de " + mes + " de " + ano;

    }


    /* COLOCAR DATA NA TELA */

    const campoData = document.getElementById("cert-data");

    if (campoData) {
        campoData.textContent = getDataCertificado();
    }

});