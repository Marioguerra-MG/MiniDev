document.addEventListener("DOMContentLoaded", function(){

    const button = document.getElementById("certificado");
    const courseOrder = ["logic","html","css","javascript","ai"];

    function getProgress(course){
        return JSON.parse(localStorage.getItem("logicakids_progress_" + course)) || {currentPhase:0};
    }

    function isCourseFinished(course){
        const TOTAL_PHASES = 3;
        return getProgress(course).currentPhase > TOTAL_PHASES;
    }

    function checkCertificate(){

        let finished = true;

        for(let course of courseOrder){
            if(!isCourseFinished(course)){
                finished = false;
            }
        }

        if(finished){
            button.style.display = "block";
        }

    }

    function generateCertificate(){

        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 700;

        const ctx = canvas.getContext("2d");

        // Fundo colorido estilo Roblox
        const gradient = ctx.createLinearGradient(0,0,1000,700);
        gradient.addColorStop(0, "#ffce00");
        gradient.addColorStop(1, "#ff4d4d");
        ctx.fillStyle = gradient;
        ctx.fillRect(0,0,1000,700);

        // Bordas
        ctx.strokeStyle = "#2d3436";
        ctx.lineWidth = 12;
        ctx.strokeRect(20,20,960,660);

        // Título
        ctx.fillStyle = "#fff";
        ctx.font = "bold 60px Comic Sans MS";
        ctx.textAlign = "center";
        ctx.fillText("🏆 Certificado de Conquista",500,120);

        // Mensagem
        ctx.font = "40px Comic Sans MS";
        ctx.fillText("Parabéns, pequeno programador!",500,220);

        ctx.font = "bold 45px Comic Sans MS";
        ctx.fillText("Você concluiu todos os cursos Logicakids!",500,300);

        // Detalhes
        const today = new Date().toLocaleDateString();
        ctx.font = "28px Comic Sans MS";
        ctx.fillText("Data: " + today,500,400);

        // Adicionando estilo divertido tipo Roblox (blocos e estrelas)
        ctx.fillStyle = "#fff200";
        ctx.beginPath();
        ctx.moveTo(500,500);
        ctx.lineTo(520,550);
        ctx.lineTo(480,550);
        ctx.closePath();
        ctx.fill();

        // Download automático
        const link = document.createElement("a");
        link.download = "certificado_logicakids.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

    }

    button.addEventListener("click", generateCertificate);

    checkCertificate();

});