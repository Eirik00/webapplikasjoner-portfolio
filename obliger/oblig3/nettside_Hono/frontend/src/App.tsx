import Layout from './components/Layout';
import Projects from './components/Projects';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ProjectForm from './components/ProjectForm';
import useProjects from './hooks/useProjects';
import { useEffect, useState } from 'react';
import { ProjectType } from './types';


function App() {
  const { projects, error, setNewProject, updateProject } = useProjects();
  const [initialProject, setInitialProject] = useState<ProjectType>()
  const navigate = useNavigate()

  if(error){
    return(<Layout>
      <h1>Error: {error.message}</h1>
    </Layout>);
  }
  useEffect(() => {
    if (initialProject) {
      // Navigate to /update-project/ when initialProject is set
      navigate('/update-project/');
    }
  }, [initialProject, navigate]);


  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Projects setInitialProject={setInitialProject} projectList={projects}/>} />
        <Route path="/create-project/" element={<ProjectForm onSubmit={setNewProject} mode="create" />} />
        <Route path="/update-project/" element={<ProjectForm initialProject={initialProject} onSubmit={updateProject} mode="edit" />} />
      </Routes>
    </Layout>
  );
}

export default App;
