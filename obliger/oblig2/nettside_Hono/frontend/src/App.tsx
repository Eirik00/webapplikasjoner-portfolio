import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Projects from './components/Projects'
import { Route, Routes } from 'react-router-dom'
import CreateProjects from './components/CreateProjects'


function App() {
  const [projects, setProjects] = useState([])
  const [newProject, setNewProject] = useState({})

  const getProjects = async() =>{
    fetch("http://127.0.0.1:3000/data")
    .then(response => response.json())
    .then(data => setProjects(data))
    .catch(err => console.log("error with api: ", err))
  }



  useEffect(()=>{
    getProjects()
  }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Projects projectList={projects}/>} />
        <Route path="/create-project/" element={<CreateProjects setNewProject={setNewProject} />} />
      </Routes>
    </Layout>
  )
}

export default App
