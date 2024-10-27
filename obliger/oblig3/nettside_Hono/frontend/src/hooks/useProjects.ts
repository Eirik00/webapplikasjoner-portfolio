import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config';


const useProjects = () => {
  const [projects, setProjects] = useState([]);
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

  useEffect(() => {
    getProjects();
  }, []);

  return { projects, error };
};

export default useProjects;