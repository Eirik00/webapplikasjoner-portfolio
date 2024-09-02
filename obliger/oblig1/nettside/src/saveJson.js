//import { fs } from "fs";


document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("projectForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const projectName = document.getElementById("projectName").value;
        const projectDesc = document.getElementById("projectDescription").value;
        const projectPrivate = document.getElementById("projectPrivate").checked;
        console.log(`navn: ${projectName} | Desc: ${projectDesc} | privat? ${projectPrivate}`);
    });
})