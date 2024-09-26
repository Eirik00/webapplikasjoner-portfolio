export type ProjectType = {
    projectId: number,
    projectName: string,
    description: string,
    status: string,
    createdAt: Date,
    category: string,
    public: boolean,
    Admin: ProjectAdmin[]
    contributer: ProjectContributer[]
}

type ProjectAdmin = {
    userID: number
}
type ProjectContributer = {
    userID: number,
    access: number
}