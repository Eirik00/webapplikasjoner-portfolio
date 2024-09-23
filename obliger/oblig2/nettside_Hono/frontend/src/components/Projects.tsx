import ProjectCard from "./ProjectCard"

export default function Projects({ projectList }:any ) {
    return(
        <main>
            {projectList?.map((projects:any) => <ProjectCard key={projects.projectId}
            projectName={projects.projectName} description={projects.description} 
            admin={projects.Admin} userList={projects.contributer} />)}
        </main>
    )
}