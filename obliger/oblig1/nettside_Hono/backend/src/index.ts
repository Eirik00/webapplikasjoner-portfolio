import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"
import { ProjectSchema, type Project} from "../types"
import fs, { readFile } from "node:fs/promises"

const app = new Hono()
app.use("/*", cors())

const projects: Project[] = []

async function setData(){
  const data = await fs.readFile("./JSON/projects.json", "utf-8")
  const dataAsJson = JSON.parse(data)
  dataAsJson?.map((item: any) => projects.push(item))
}
setData()

app.post("/data/add", async (c) => {
  const newProject = await c.req.json()
  const project = ProjectSchema.parse(newProject)
  if(!project) return c.json({error: "invalid project"}, { status: 400 })
  console.log(project)
  projects.push(project)

  const jsonData = await readFile("./JSON/projects.json", "utf-8")
  const data = JSON.parse(jsonData)

  await fs.writeFile(
    "./JSON/projects.json",
    JSON.stringify([...data, project], null, 2)
  )

  return c.json<Project[]>(projects, {status: 201})
})


app.get("/data", (c) => {
  return c.json<Project[]>(projects)
})

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
