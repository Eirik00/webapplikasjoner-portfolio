import { z } from "zod";

const contributerSchema = z.object({
    userID: z.number(),
    role: z.string(),
    access: z.number().int().min(0).max(10),
});

export const ProjectSchema = z.object({
    projectId: z.number(),
    projectName: z.string().min(1, "Project name is required"),
    description: z.string(),
    status: z.enum(["draft", "in-progress", "completed", "on-hold"]),
    createdAt: z.date(),
    category: z.string(),
    public: z.boolean(),
    admin: z.object({
        userID: z.number(),
    }),
    contributer: z.array(contributerSchema),
});

export const CreateProjectSchema = ProjectSchema.omit({
    projectId: true,
    createdAt: true,
});

export const UpdateProjectSchema = ProjectSchema.partial().extend({
    projectId: z.number(),
});

export type ProjectType = z.infer<typeof ProjectSchema>;
export type CreateProjectType = z.infer<typeof CreateProjectSchema>;
export type UpdateProjectType = z.infer<typeof UpdateProjectSchema>;

export const validateProject = (data: unknown): ProjectType => {
    return ProjectSchema.parse(data);
};

export const validateCreateProject = (data: unknown): CreateProjectType => {
    return CreateProjectSchema.parse(data);
};

export const validateUpdateProject = (data: unknown): UpdateProjectType => {
    return UpdateProjectSchema.parse(data);
};

export const ProjectResponseSchema = z.object({
    success: z.boolean(),
    data: ProjectSchema,
    message: z.string().optional(),
});

export const ProjectListResponseSchema = z.object({
    success: z.boolean(),
    data: z.array(ProjectSchema),
    totalCount: z.number(),
    page: z.number().optional(),
    pageSize: z.number().optional(),
});

export const ProjectErrorResponseSchema = z.object({
    success: z.boolean(),
    error: z.string(),
    code: z.number().optional(),
});

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;
export type ProjectListResponse = z.infer<typeof ProjectListResponseSchema>;
export type ProjectErrorResponse = z.infer<typeof ProjectErrorResponseSchema>;