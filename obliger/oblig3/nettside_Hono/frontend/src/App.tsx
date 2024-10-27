import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Projects from './components/Projects';
import { Route, Routes } from 'react-router-dom';
import CreateProjects from './components/CreateProjects';
import useProjects from './hooks/useProjects';
import { ProjectType } from './types';
import { API_CONFIG } from './config';


function App() {
  const { projects, error } = useProjects();

  if(error){
    return(<Layout>
      <h1>Error: {error.message}</h1>
    </Layout>);
  }

  const setNewProject = async(newProject: ProjectType) => {
    try{
      const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.addProject}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProject)
      });

      console.log(response);
      if (response.status === 201){
        document.location.href="/"
      };
    }catch(err: unknown){
      console.log(err)
    }
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Projects projectList={projects}/>} />
        <Route path="/create-project/" element={<CreateProjects setNewProject={setNewProject} />} />
      </Routes>
    </Layout>
  );
}

export default App;
