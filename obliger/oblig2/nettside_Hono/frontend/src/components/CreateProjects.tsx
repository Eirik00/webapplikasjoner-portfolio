import { useState } from "react"
import { ProjectType } from "../types";

export default function CreateProjects({setNewProject}: { setNewProject: (project: ProjectType) => Promise<void> }){
    const [formData, setFormData] = useState<ProjectType>({
        projectId: 0,
        projectName: "",
        description: "",
        status: "draft",
        createdAt: new Date(),
        category: "",
        public: false,
        admin: [{userID: 123}],
        contributer: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type } = e.target;
    
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked; // Type assertion for checkbox
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            const value = (e.target as HTMLTextAreaElement | HTMLInputElement).value; // Type assertion for input or textarea
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async(e: React.SyntheticEvent) => {
        e.preventDefault();
        await setNewProject(formData);
        setFormData({
            projectId: 0,
            projectName: "",
            description: "",
            status: "draft",
            createdAt: new Date(),
            category: "",
            public: false,
            admin: [{userID: 123}],
            contributer: [],
        });
    };


    return(
        <form onSubmit={handleSubmit}>
            <label htmlFor="projectName">Prosjekt Navn:</label>
            <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} required />

            <label htmlFor="projectPrivate">Privat Prosjekt?</label>
            <input type="checkbox" id="projectPrivate" name="public" checked={formData.public} onChange={handleChange} />
            <br />
            <label htmlFor="projectDescription">Prosjekt Beskrivelse:</label>
            <textarea id="projectDescription" name="description" rows={8} cols={50} value={formData.description} onChange={handleChange}></textarea>

            <button type="submit" id="submitBtn">Lag Prosjekt</button>
        </form>
    )
}