import { createContext, useContext, useState } from 'react'
import axios from 'axios'

export const ProjectsContext = createContext()

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([])

	function getProject(id) {
  	return projects.find(project => project.id === id)
	}

  const providerValue = {
    projects,
    setProjects,
    getProject,
  }

  return (
    <ProjectsContext.Provider value={providerValue}>
      {children}
    </ProjectsContext.Provider>
  )
}

export function useProjectsContext() {
  const context = useContext(ProjectsContext)

  if (!context) {
    throw new Error('useProjectsContext out of scope')
  }

  return context
}

