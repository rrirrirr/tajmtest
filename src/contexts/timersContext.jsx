import { createContext, useContext, useRef, useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import { useResolvedPath } from 'react-router-dom'

export const TimersContext = createContext()

export function TimersProvider({ children }) {
  const [timers, setTimers] = useState([])
  const [activeTimers, setActiveTimers] = useState([])
  const [activeTimersUpdate, setActiveTimersUpdate] = useState(1)
  const interval = useRef()

  useEffect(() => {
    if (timers.length) {
      setActiveTimers(
        timers
          .filter((timer) => !timer.end.length)
          .map((timer) => {
            return { ...timer, elapsed: '' }
          })
      )
    }
  }, [timers])

  useEffect(() => {
    if (activeTimers.length) {
      if (!interval.current) {
        interval.current = setInterval(() => {
          const now = new Date()
          setActiveTimers(
            activeTimers.map((timer) => {
              return {
                ...timer,
                elapsed: Math.round((now - new Date(timer.start)) / 1000)
              }
            })
          )
        }, 1000)
      }
    } else {
      clearInterval(interval.current)
      interval.current = null
    }
    // return () => clearInterval(interval.current)
  }, [activeTimers])

  function getTimer(id) {
    return timers.find((timer) => timer.id == id)
  }

  function getLatestTimer(id) {
    const filteredTimers = timers.filter((timer) => timer.taskId === id)
    const sortedTimers = filteredTimers.sort((a, b) => {
      const dateA = a.end ? new Date(a.end) : new Date()
      const dateB = b.end ? new Date(b.end) : new Date()
      return dateA - dateB
    })
    return sortedTimers.length ? sortedTimers.at(-1) : false
  }

  function getTimers(id) {
    return timers.filter((timer) => timer.taskId === id)
  }

  function getActiveTimerIndex(id) {
    const timer = activeTimers.findIndex((timer) => timer.taskId === id)
    return timer
  }

  const providerValue = {
    timers,
    activeTimers,
    getTimer,
    getTimers,
    setTimers,
    getLatestTimer,
    getActiveTimerIndex,
    activeTimersUpdate
  }

  return (
    <TimersContext.Provider value={providerValue}>
      {children}
    </TimersContext.Provider>
  )
}

export function useTimersContext() {
  const context = useContext(TimersContext)

  if (!context) {
    throw new Error('useTimersContext out of scope')
  }

  return context
}
