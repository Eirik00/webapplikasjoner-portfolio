import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from "hono/cors"
import { ProjectSchema, type Project } from "../types"
import Database from 'better-sqlite3'
import pino from 'pino'

interface DbProject {
  projectId: number;
  projectName: string;
  description: string;
  status: "draft" | "in-progress" | "completed" | "on-hold";
  createdAt: string;
  category: string;
  public: number;
  adminUserId: number;
}

interface DbContributer {
  userId: number;
  access: number;
}

// Initialize the logger with proper types
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
}) as unknown as pino.Logger

// Initialize SQLite database
const db = new Database('projects.db')

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    projectId INTEGER PRIMARY KEY,
    projectName TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK(status IN ('draft', 'in-progress', 'completed', 'on-hold')) NOT NULL,
    createdAt TEXT NOT NULL,
    category TEXT NOT NULL,
    public BOOLEAN NOT NULL,
    adminUserId INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS contributers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    access INTEGER NOT NULL CHECK(access >= 0 AND access <= 10),
    FOREIGN KEY (projectId) REFERENCES projects(projectId) ON DELETE CASCADE,
    UNIQUE(projectId, userId)
  );
`)

const app = new Hono()
app.use("/*", cors())

interface DbError extends Error {
  message: string;
}

// Helper function to convert DB row to Project type
function dbRowToProject(row: DbProject, contributers: DbContributer[]): Project {
  return {
    projectId: row.projectId,
    projectName: row.projectName,
    description: row.description,
    status: row.status,
    createdAt: new Date(row.createdAt),
    category: row.category,
    public: Boolean(row.public),
    admin: {
      userID: row.adminUserId,
    },
    contributer: contributers.map(c => ({
      userID: c.userId,
      access: c.access,
    }))
  }
}

app.post("/data/add", async (c) => {
  try {
    const newProject = await c.req.json()

    if(typeof newProject.createdAt === "string"){
      newProject.createdAt = new Date(newProject.createdAt)
    }

    const project = ProjectSchema.parse(newProject)
    
    // Start a transaction
    const transaction = db.transaction(() => {
      // Insert main project data
      const projectStmt = db.prepare(`
        INSERT INTO projects (
          projectId, projectName, description, status, 
          createdAt, category, public, adminUserId
        ) VALUES (
          @projectId, @projectName, @description, @status,
          @createdAt, @category, @public, @adminUserId
        )
      `)

      projectStmt.run({
        projectId: project.projectId,
        projectName: project.projectName,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt.toISOString(),
        category: project.category,
        public: project.public ? 1 : 0,
        adminUserId: project.admin.userID
      })

      // Insert contributers
      const contributerStmt = db.prepare(`
        INSERT INTO contributers (projectId, userId, access)
        VALUES (@projectId, @userId, @access)
      `)

      for (const contributer of project.contributer) {
        contributerStmt.run({
          projectId: project.projectId,
          userId: contributer.userID,
          access: contributer.access
        })
      }
    })

    // Execute transaction
    transaction()

    logger.info('New project added', { projectId: project.projectId })
    
    // Fetch and return the newly created project
    return c.json(await getProject(project.projectId), {status: 201})
    
  } catch(err) {
    const error = err as DbError
    logger.error('Failed to add project', { error: error.message })
    return c.json({error: "Failed to add project"}, {status: 500})
  }
})

app.delete("/data/delete", async (c) => {
  try {
    const body = await c.req.json()
    const { projectId } = body

    const transaction = db.transaction(() => {
      // Delete contributers first (due to foreign key constraint)
      db.prepare('DELETE FROM contributers WHERE projectId = ?').run(projectId)
      // Delete the project
      const result = db.prepare('DELETE FROM projects WHERE projectId = ?').run(projectId)
      
      if (result.changes === 0) {
        throw new Error('Project not found')
      }
    })

    try {
      transaction()
      logger.info('Project deleted successfully', { projectId })
      return c.json({message: "Project deleted successfully"}, {status: 200})
    } catch(err) {
      const error = err as DbError
      if (error.message === 'Project not found') {
        return c.json({error: "Project doesn't exist"}, {status: 404})
      }
      throw error
    }
  } catch(err) {
    const error = err as DbError
    logger.error('Failed to delete project', { error: error.message })
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
    
    const transaction = db.transaction(() => {
      // Update main project data
      const projectStmt = db.prepare(`
        UPDATE projects 
        SET projectName = @projectName,
            description = @description,
            status = @status,
            createdAt = @createdAt,
            category = @category,
            public = @public,
            adminUserId = @adminUserId
        WHERE projectId = @projectId
      `)

      const result = projectStmt.run({
        projectId: project.projectId,
        projectName: project.projectName,
        description: project.description,
        status: project.status,
        createdAt: project.createdAt.toISOString(),
        category: project.category,
        public: project.public ? 1 : 0,
        adminUserId: project.admin.userID
      })

      if (result.changes === 0) {
        throw new Error('Project not found')
      }

      // Delete existing contributers and insert new ones
      db.prepare('DELETE FROM contributers WHERE projectId = ?').run(project.projectId)
      
      const contributerStmt = db.prepare(`
        INSERT INTO contributers (projectId, userId, access)
        VALUES (@projectId, @userId, @access)
      `)

      for (const contributer of project.contributer) {
        contributerStmt.run({
          projectId: project.projectId,
          userId: contributer.userID,
          access: contributer.access
        })
      }
    })

    try {
      transaction()
      return c.json(await getProject(project.projectId), {status: 200})
    } catch(err) {
      const error = err as DbError
      if (error.message === 'Project not found') {
        return c.json({error: "Project doesn't exist"}, {status: 404})
      }
      throw error
    }
  } catch(err) {
    const error = err as DbError
    logger.error('Failed to update project', { error: error.message })
    return c.json({error: "Failed to update project"}, {status: 500})
  }
})

// Helper function to get a single project with its contributers
async function getProject(projectId: number): Promise<Project | null> {
  const project = db.prepare<[number], DbProject>('SELECT * FROM projects WHERE projectId = ?').get(projectId)
  if (!project) return null

  const contributers = db.prepare<[number], DbContributer>(
    'SELECT userId, access FROM contributers WHERE projectId = ?'
  ).all(projectId)
  return dbRowToProject(project, contributers)
}

app.get("/data", (c) => {
  logger.info('Data requested')
  const projects = db.prepare<[], DbProject>('SELECT * FROM projects').all()
  const result: Project[] = projects.map(project => {
    const contributers = db.prepare<[number], DbContributer>(
      'SELECT userId, access FROM contributers WHERE projectId = ?'
    ).all(project.projectId)
    return dbRowToProject(project, contributers)
  })
  return c.json(result)
})

const port = 3000
logger.info(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})