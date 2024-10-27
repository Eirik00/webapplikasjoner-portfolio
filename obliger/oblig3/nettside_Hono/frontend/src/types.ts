export type ProjectType = {
    projectId: number,
    projectName: string,
    description: string,
    status: string,
    createdAt: Date,
    category: string,
    public: boolean,
    admin: ProjectAdmin[]
    contributer: ProjectContributer[]
}

type ProjectAdmin = {
    userID: number
}
type ProjectContributer = {
    userID: number,
    access: number
}