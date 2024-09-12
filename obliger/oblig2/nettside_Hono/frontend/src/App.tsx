import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Projects from './components/Projects'


function App() {
  const [projects, setProjects] = useState([])

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
      <Projects projectList={projects}/>
    </Layout>
  )
}

export default App
