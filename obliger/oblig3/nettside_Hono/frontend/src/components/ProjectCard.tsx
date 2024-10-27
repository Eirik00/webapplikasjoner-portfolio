export default function ProjectCard( { projectName, description, admin, userList }:any ) {
    return(
        <article>
            <h2>{projectName}</h2>
            <hr />
            <p>{description}</p>
            <hr />
            <h3>Owner: {admin.userID}</h3>
            <ul>
                {userList?.map((item: any)=>{<li>{item.userID}</li>})}
            </ul>
        </article>
    )
}