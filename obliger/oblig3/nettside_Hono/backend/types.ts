import { z } from "zod";

const contributerSchema = z.object({
        userID: z.number(),
        access: z.number().int().min(0).max(10),
})

export const ProjectSchema = z.object({
    projectId: z.number(),
    projectName: z.string(),
    description: z.string(),
    status: z.enum(["draft", "in-progress", "completed", "on-hold"]),
    createdAt: z.date(),
    category: z.string(),
    public: z.boolean(),
    admin: z.object({
        userID: z.number(),
    }),
    contributer: z.array(contributerSchema)
});

export const ProjectCreateShema = ProjectSchema;

export const ProjectArraySchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;

export type CreateProject = z.infer<typeof ProjectCreateShema>;