async function fetchJSON() {
    try {
        const response = await fetch("../JSON/projects.json");
        if(!response.ok){
            throw new Error("couldnt get json" + response.statusText);
        }

        const data = await response.json();

        return data;
    }catch (err) {
        console.error(err)
    }
    return [];
}
const mainTag = document.getElementsByTagName("main")[0];

fetchJSON().then((data) => { 

    data?.map(item => {
        
        const userList = item.contributer.map(contributer => 
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