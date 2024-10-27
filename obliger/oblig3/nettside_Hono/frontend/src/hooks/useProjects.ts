import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config';
import { ProjectType } from '../types';


const useProjects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const getProjects = async () => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.projects}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err: unknown) {
      if(err instanceof Error) {
        setError(err);
        console.log("error with api: ", err);
      }else{
        setError(new Error("An unknown error occured!"));
      }
    }
  };

  const setNewProject = async(newProject: ProjectType) => {
    try{
      const sendProject = {
        ...newProject,
        createdAt: newProject.createdAt instanceof Date
        ? newProject.createdAt.toISOString()
        : newProject.createdAt,
      };

      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.addProject}`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendProject)
      });

      console.log(response);
      if(response.status === 201){
        document.location.href = "/";
      }
    }catch(err: unknown){
      console.log(err);
    }
  }


  const deleteProject = async (projectId: number) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.deleteProject}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId })
      });

      if(!response.ok) {
        throw new Error("failed to delete project");
      }

      await getProjects();
    }catch(err){
      console.log(err);
    }
  }

  const updateProject = async (newProject: ProjectType) => {
    try {
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.updateProject}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject)
      });
      if(response.status === 201){
        document.location.href = "/";
      }
    }catch(err){
      console.log(err);
    }
  }

  useEffect(() => {
    getProjects();
  }, []);

  return { projects, error, setNewProject, deleteProject, updateProject };
};

export default useProjects;