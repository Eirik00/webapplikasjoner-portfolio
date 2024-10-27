import { formatDate } from "date-fns"
import { ProjectType } from "../types"
import useProjects from "../hooks/useProjects";

type ProjectCardProp = {
    project: ProjectType;
    setInitialProject: any;
}

export default function ProjectCard( { project, setInitialProject }: ProjectCardProp ) {
    const { deleteProject } = useProjects();

    const handleDelete = async () => {
        try {
            await deleteProject(project.projectId);
            console.log(`Project ${project.projectId} deleted`);
        }catch(err){
            console.error("Error deleing project: ", err);
        }
    };

    const handleUpdate = () =>{
        setInitialProject(project)
    }

    return(
        <article>
            <h2>{project.projectName}</h2>
            <h3>Project Start Date: {formatDate(project.createdAt, "MMMM dd, yyyy")}</h3>
            <p>{project.public ? "Public" : "Private"}</p>
            <hr />
            <p>{project.description}</p>
            <hr />
            <h3>Owner: {project.admin.userID}</h3>
            <ul>
                {project.contributer?.map((item, index) =>(
                    <li key={index}>{item.userID}</li>
                ))}
            </ul>
            <hr />
            <p>{project.status}</p>
            <button onClick={handleDelete}>Delete</button>
            <button onClick={handleUpdate}>Update</button>
        </article>
    )
}