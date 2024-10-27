import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"
import { ProjectSchema, type Project} from "../types"
import fs, { readFile } from "node:fs/promises"
import pino from 'pino'

// Initialize the logger
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

const app = new Hono()
app.use("/*", cors())

const projects: Project[] = []

async function setData(){
  const data = await fs.readFile("./JSON/projects.json", "utf-8")
  const dataAsJson = JSON.parse(data)
  dataAsJson?.map((item: any) => projects.push(item))
  logger.info('Initial data loaded', { projectCount: projects.length })
}
setData()

app.post("/data/add", async (c) => {
  try {
    const newProject = await c.req.json()

    if(typeof newProject.createdAt === "string"){
      newProject.createdAt = new Date(newProject.createdAt)
    }

    const project = ProjectSchema.parse(newProject)
    if(!project){
      logger.warn('Invalid project received', { project: newProject })
      return c.json({error: "invalid project"}, {status: 400})
    }
    
    logger.info('New project added', { project })
    projects.push(project)

    const jsonData = await readFile("./JSON/projects.json", "utf-8")
    const data = JSON.parse(jsonData)

    await fs.writeFile(
      "./JSON/projects.json",
      JSON.stringify([...data, project], null, 2)
    )

    return c.json<Project[]>(projects, {status: 201})
    
  }catch(err){
    logger.error('Failed to add project', { error: err })
    return c.json({error: "Failed to add project"}, {status: 500})
  }
})

app.delete("/data/delete", async (c) => {
  try {
    const body = await c.req.json()
    logger.info('Raw request body received:', body)  // Log the entire body

    const { projectId } = body  // Destructure projectId, not projectToDelete
    logger.info('ProjectId extracted:', projectId)

    logger.info('Current projects:', projects)

    const projectIndex = projects.findIndex(project => {
      logger.info('Comparing:', {
        currentProjectId: project.projectId,
        typeOfCurrentId: typeof project.projectId,
        searchProjectId: projectId,
        typeOfSearchId: typeof projectId
      })
      return project.projectId === projectId
    })

    if(projectIndex === -1) {
      logger.warn('Project not found', { projectId })
      return c.json({error: "Project doesnt exist"}, {status:404})
    }

    projects.splice(projectIndex, 1)

    await fs.writeFile("./JSON/projects.json", JSON.stringify(projects, null, 2))
    
    logger.info('Project deleted successfully', { projectId })
    return c.json({message: "Project deleted successfully"}, {status: 200})
  }catch(err){
    logger.error('Failed to delete project', { error: err })
    return c.json({error: "Failed to delete project"}, {status: 500})
  }
})

app.put("/data/update", async (c) => {
  try {
    const newProject = await c.req.json()

    if(typeof newProject.createdAt === "string"){
      newProject.createdAt = new Date(newProject.createdAt)
    }

    const project = ProjectSchema.parse(newProject)
    if(!project){
      logger.warn('Invalid project received', { project: newProject })
      return c.json({error: "invalid project"}, {status: 400})
    }
    
    const projectIndex = projects.findIndex(project => {
      return project.projectId === newProject.projectId
    })

    if(projectIndex === -1){
      return c.json({error: "Tried to update a non-existing project"}, {status: 404})
    }
    
    projects[projectIndex] = newProject
    const jsonData = await readFile("./JSON/projects.json", "utf-8")
    const data = JSON.parse(jsonData)

    await fs.writeFile(
      "./JSON/projects.json",
      JSON.stringify([...data, project], null, 2)
    )

    return c.json<Project[]>(projects, {status: 201})
  }catch(err){
    return c.json({error: "Failed to update project"}, {status: 500})
  }
})

app.get("/data", (c) => {
  logger.info('Data requested')
  return c.json<Project[]>(projects)
})

const port = 3000
logger.info(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})