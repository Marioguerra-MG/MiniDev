document.addEventListener("DOMContentLoaded",function(){

const courseOrder=["logic","html","css","javascript","ai"];


/* ========================= */
/* PEGAR PROGRESSO */
/* ========================= */

function getProgress(course){

return JSON.parse(
localStorage.getItem("logicakids_progress_"+course)
) || {xp:0};

}


/* ========================= */
/* GERAR CERTIFICADO */
/* ========================= */

function generateCertificate(){

const childName=localStorage.getItem("childName") || "Mini Dev";

let totalXP=0;

courseOrder.forEach(course=>{

const progress=getProgress(course);

totalXP+=progress.xp || 0;

});

const level=Math.floor(totalXP/50)+1;


/* COLOCAR DADOS */

document.getElementById("cert-nome").innerText=childName;
document.getElementById("cert-xp").innerText=totalXP;
document.getElementById("cert-nivel").innerText=level;
document.getElementById("cert-data").innerText=getDataCertificado();


/* MOSTRAR CERTIFICADO */

const cert=document.getElementById("certificadoModelo");

cert.style.display="block";


/* GERAR IMAGEM */

html2canvas(cert).then(canvas=>{

const link=document.createElement("a");

link.download=`Certificado-${childName}.png`;

link.href=canvas.toDataURL("image/png");

link.click();

cert.style.display="none";

});

}


/* DISPONIBILIZAR GLOBAL */

window.generateCertificate=generateCertificate;


/* ========================= */
/* DATA */
/* ========================= */

function getDataCertificado(){

const hoje=new Date();

const dia=hoje.getDate();
const ano=hoje.getFullYear();

const meses=[
"Janeiro","Fevereiro","Março","Abril","Maio","Junho",
"Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const mes=meses[hoje.getMonth()];

return dia+" de "+mes+" de "+ano;

}


/* COLOCAR DATA */

const campoData=document.getElementById("cert-data");

if(campoData){
campoData.textContent=getDataCertificado();
}

});