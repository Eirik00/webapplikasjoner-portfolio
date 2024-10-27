import { useEffect, useState } from "react";
import { ProjectType } from "../types";
import useProjects from "../hooks/useProjects";

interface ProjectFormProps {
  initialProject?: ProjectType;
  onSubmit: (project: ProjectType) => Promise<void>;
  mode: "create" | "edit";
}

export default function ProjectForm({ initialProject, onSubmit, mode }: ProjectFormProps) {
  const { projects } = useProjects();
  const [formData, setFormData] = useState<ProjectType>({
    projectId: 0,
    projectName: "",
    description: "",
    status: "draft",
    createdAt: new Date(),
    category: "",
    public: false,
    admin: { userID: 123 },
    contributer: [],
  });

  useEffect(() => {
    if (mode === "edit" && initialProject) {
      setFormData(initialProject);
    } else if (mode === "create") {
      const initialProjectId = projects.length > 0 ? projects[projects.length - 1].projectId + 1 : 1;
      setFormData(prev => ({ ...prev, projectId: initialProjectId }));
    }
  }, [mode, initialProject, projects]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "tags" || name === "technologies") {
      const arrayValue = value.split(",").map(item => item.trim());
      setFormData(prev => ({ ...prev, [name]: arrayValue }));
    } else if (name === "progress") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    if (mode === "create") {
      setFormData({
        projectId: 0,
        projectName: "",
        description: "",
        status: "draft",
        createdAt: new Date(),
        category: "",
        public: false,
        admin: { userID: 123 },
        contributer: [],
      });
    }
  };

  if (mode === "create" && formData.projectId === 0) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium">
            Project Name:
          </label>
          <input
            type="text"
            id="projectName"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium">
            Status:
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border"
          >
            <option value="draft">Draft</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium">
            Category:
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            rows={8}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border"
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="public"
              checked={formData.public}
              onChange={handleChange}
              className="rounded border"
            />
            <span className="text-sm font-medium">Public Project</span>
          </label>
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        {mode === "create" ? "Create Project" : "Update Project"}
      </button>
    </form>
  );
}