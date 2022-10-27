import { createContext, useContext, useState } from 'react'
import { useEffect } from 'react'

export const TasksContext = createContext()

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([])

  function getTasks(id) {
    return tasks.filter(task => task.projectId == id)
  }

  function getTask(id) {
		return tasks.find(task => task.id == id) || {id, title: 'new', projectId: 'none'}
  }

  const providerValue = {
    tasks,
    getTasks,
    setTasks,
    getTask
  }

  return (
    <TasksContext.Provider value={providerValue}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasksContext() {
  const context = useContext(TasksContext)

  if (!context) {
    throw new Error('useTasksContext out of scope')
  }
  return context
}
