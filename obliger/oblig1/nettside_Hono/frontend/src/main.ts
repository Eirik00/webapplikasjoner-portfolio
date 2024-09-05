import { ofetch } from "ofetch";

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("projectForm");

    form?.addEventListener("submit", async function(event) {
        event.preventDefault();

        const projectName = (<HTMLInputElement>document.getElementById("projectName"))?.value;
        const projectDesc = (<HTMLInputElement>document.getElementById("projectDescription"))?.value;
        const projectPrivate = (<HTMLInputElement>document.getElementById("projectPrivate"))?.checked;
        console.log(`navn: ${projectName} | Desc: ${projectDesc} | privat? ${projectPrivate}`);
    
        const newProject = {
            projectName: projectName,
            description: projectDesc,
            status: "none",
            public: projectPrivate,
            Admin: {
                userID: 231,
            },
            contributer: [
                {
                    userID: 123,
                    access: 1,
                }
            ],
        }

        try {
            const response = await fetch("http://localhost:3000/data/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProject),
            });

            console.log(response)
            if (response.status === 201){
                document.location.href="/";
            }
        }catch(err){
            console.log(err);
        }
    });
})

let mainTag = document.getElementById("projectsList");
if(mainTag !== null){
    ofetch("http://localhost:3000/data")
    .then((res)=> {
        console.log(res[0])
        res?.map((item: any) => {
                const userList = item.contributer?.map((contributer: any) => 
                    `<li>${contributer.userID}</li>`
                ).join('') || '';
        
                mainTag.innerHTML = mainTag.innerHTML + `
                <article>
                    <h2>${item.projectName}</h2>
                    <hr>
                    <p>${item.description}</p>
                    <hr>
                    <h3>Owner: ${item.Admin.userID}</h3>
                    <ul>
                        ${userList}
                    </ul>
                </article>    
                `;
            })
    });
}