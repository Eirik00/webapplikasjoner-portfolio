import { useEffect, useState } from "react"
import ProjectCard from "./ProjectCard"
import { ProjectType } from "../types"

type CategoryType = {
    name: string,
    ammount: number,
}

export default function Projects({ projectList, setInitialProject }:any ) {
    const [categoryList, setCategoryList] = useState<CategoryType[]>([])

    const getProjectCategories = () =>{
        const newCategoryList = projectList?.reduce((acc: CategoryType[], project: ProjectType)=> {
            const existingCategory = acc.find(cat => cat.name === project.category)
            if (existingCategory) {
                existingCategory.ammount += 1
            } else {
                acc.push({name: project.category, ammount: 1})
            }
            return acc
        }, [])
        setCategoryList(newCategoryList)
    }

    useEffect(() => {
        getProjectCategories()
    }, [projectList])

    return(
        <main>
            <p>Categories:</p>
            <ul>
                {categoryList?.map((item: CategoryType, index: number) => <li key={index}>{item.name}: {item.ammount}</li>)}
            </ul>
            {projectList?.map((projects:ProjectType) => <ProjectCard key={projects.projectId}
            project={projects} setInitialProject={setInitialProject} />)}
        </main>
    )
}