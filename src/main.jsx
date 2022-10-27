import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Root from './routes/root'
import Users, { loader as usersLoader } from './routes/users'
import User, { loader as userLoader } from './routes/user'
import NewUser, { action as addUserAction } from './routes/newUser'

import Overview from './routes/overview'
import History from './routes/history'

import Project, { loader as projectLoader } from './routes/project'
import Projects, { action as projectAction } from './routes/projects'
import EditProject, { action as projectEditAction } from './routes/editProject'
import { action as deleteProjectAction } from './routes/deleteProject'

import Task, { loader as taskLoader } from './routes/task'
import Tasks, {
  loader as tasksLoader,
  action as taskAction
} from './routes/tasks'
import EditTask, { action as taskEditAction } from './routes/editTask'
import { action as deleteTaskAction } from './routes/deleteTask'

import Timers, { loader as timersLoader } from './routes/timers'
import Timer, { loader as timerLoader } from './routes/timer'
import { startTaskTimerAction, stopTaskTimerAction, deleteTaskTimerAction } from './routes/taskTimer'

import './index.css'
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom'
import { ProjectsProvider } from './contexts/projectsContext'
import { TasksProvider } from './contexts/tasksContext'
import { TimersContext, TimersProvider } from './contexts/timersContext'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'users',
        element: <Users />,
        loader: usersLoader
      },
      { path: 'newUser', element: <NewUser />, action: addUserAction },
      {
        path: ':user',
        element: <User />,
        loader: userLoader,
        children: [
          {
            path: 'history',
            element: <History />,
            loader: timersLoader
          },
          {
            path: 'timers',
            element: <Timers />,
            loader: timersLoader,
            children: [
              {
                path: ':taskId',
                loader: timerLoader,
                element: <Timer />
              },
              {
                path: ':taskId/start',
                action: startTaskTimerAction
              },
              {
                path: ':timerId/stop',
                action: stopTaskTimerAction
              },
              {
                path: ':timerId/destroy',
                action: deleteTaskTimerAction
              }
            ]
          },
          {
            path: 'overview',
            element: <Overview />,
            children: [
              {
                path: 'tasks',
                element: <Tasks />,
                loader: tasksLoader,
                action: taskAction
              },
              {
                path: 'tasks/:taskId',
                element: <Task />,
                loader: taskLoader
              },
              {
                path: 'tasks/:taskId/edit',
                element: <EditTask />,
                loader: taskLoader,
                action: taskEditAction
              },
              {
                path: 'tasks/:taskId/destroy',
                action: deleteTaskAction
              },
              {
                path: 'projects',
                element: <Projects />,
                action: projectAction
              },
              {
                path: 'projects/:projectId',
                element: <Project />,
                loader: projectLoader
              },
              {
                path: 'projects/:projectId/edit',
                element: <EditProject />,
                loader: projectLoader,
                action: projectEditAction
              },
              {
                path: 'projects/:projectId/destroy',
                action: deleteProjectAction
              }
            ]
          }
        ]
      }
    ]
  }
])
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TasksProvider>
      <ProjectsProvider>
        <TimersProvider>
          <RouterProvider router={router} />
        </TimersProvider>
      </ProjectsProvider>
    </TasksProvider>
  </React.StrictMode>
)
