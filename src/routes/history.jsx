import { useEffect, useState } from 'react'
import { useFetcher, Link } from 'react-router-dom'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import List from '../components/List'
import ListContent from '../components/ListContent'
import styles from './History.module.css'
import { format } from 'date-fns'
import sv from 'date-fns/locale/sv'
registerLocale('sv', sv)

import { useTasksContext } from '../contexts/tasksContext'
import { useTimersContext } from '../contexts/timersContext'
import { useProjectsContext } from '../contexts/projectsContext'
import {
  datesBetween,
  totalTime,
  totalTimeToday,
  timeBetween,
  timeString
} from '../utils/utils'
import { combineArraysByKey } from '../utils/data'

export default function History() {
  const fetcher = useFetcher()
  const { tasks } = useTasksContext()
  const { timers } = useTimersContext()
  const { projects } = useProjectsContext()
  const sortedTimers = useState([])
  const [timersWithTaskInfo, setTimersWithTaskInfo] = useState([])
  const [tasksWithProjectInfo, setTasksWithProjectInfo] = useState()
  const [startDate, setStartDate] = useState(
    new Date(new Date().toDateString())
  )
  const [endDate, setEndDate] = useState(new Date())
  const [dates, setDates] = useState(new Map())
  const [datesToShow, setDatesToShow] = useState([])

  useEffect(() => {
    if (projects.length && tasks.length && timers.length) {
      const combinedTasksAndProjects = combineArraysByKey([
        { array: tasks, key: 'projectId', props: 'all' },
        {
          array: projects,
          key: 'id',
          props: { color: 'color', name: 'projectName' }
        }
      ])
      setTasksWithProjectInfo(combinedTasksAndProjects)
      const combinedTimersAndTasks = combineArraysByKey([
        { array: timers, key: 'taskId', props: 'all' },
        {
          array: combinedTasksAndProjects,
          key: 'id',
          props: {
            title: 'task',
            color: 'color',
            projectName: 'projectName',
            id: 'projectId'
          }
        }
      ])
      setTimersWithTaskInfo(
        combinedTimersAndTasks.map((timer) => {
          return {
            ...timer,
            timeInSpan: timeBetween(
              new Date(timer.start),
              timer.end.length ? new Date(timer.end) : new Date(),
              startDate,
              endDate
            )
          }
        })
      )
    }
  }, [projects, tasks, timers])

  useEffect(() => {
    if (timersWithTaskInfo.length) {
      const dateMap = new Map()
      timersWithTaskInfo.forEach((timer) => {
        const dateStr = timer.end.length
          ? new Date(timer.end).toDateString()
          : new Date().toDateString()

        if (!dateMap.has(dateStr)) {
          dateMap.set(dateStr, [])
        }

        dateMap.get(dateStr).push(timer)
      })
      // setSortedDates(
      // [...dateMap.keys()].sort((a, b) => {
      // const ad = new Date(a)
      // const bd = new Date(b)
      // return ad < bd ? 1 : ad > bd ? -1 : 0
      // })
      // )
      setDates(dateMap)
    }
  }, [timersWithTaskInfo])

  useEffect(() => {
    if (endDate < startDate) {
      setEndDate(startDate)
      return
    }

    if (timersWithTaskInfo.length) {
      setTimersWithTaskInfo(
        timersWithTaskInfo.map((timer) => {
          return {
            ...timer,
            timeInSpan: timeBetween(
              new Date(timer.start),
              timer.end.length ? new Date(timer.end) : new Date(),
              startDate,
              endDate
            )
          }
        })
      )
    }

    if (dates.size) {
      setDatesToShow(
        datesBetween(startDate, endDate).filter((date) => dates.has(date))
      )
    } else {
      setDatesToShow(datesBetween(startDate, endDate))
    }
  }, [startDate, endDate])

  return (
    <>
      <div className={styles.datePickerContainer}>
        <div className={styles.datePicker}>
          <div>Från</div>
          <DatePicker
            locale="sv"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            className={styles.dateInput}
          />
        </div>
        <div className={styles.datePicker}>
          <div>Till</div>
          <DatePicker
            locale="sv"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            showTimeSelect
            timeFormat="p"
            dateFormat="Pp"
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            maxDate={new Date()}
            className={styles.dateInput}
          />
        </div>
      </div>
      {datesToShow.length &&
        datesToShow.map((date) => (
          <div key={date}>
            {dates.has(date) && (
              <div key={date} className={styles.tasksContainer}>
                <List title={date} color="" items={dates.get(date).length}>
                  {dates
                    .get(date)
                    .filter((timer) => timer.timeInSpan > 0)
                    .map((timer) => (
                      <ListContent
                        key={timer.id}
                        divider="true"
                        color={timer.color}
                        title={`${timer.task} - ${timeString(
                          timer.timeInSpan
                        )}`}
                        link={`../timers/${timer.id}`}
                      >
                        <Link to={`../timers/${timer.taskId}`}>
                          <h2>{timer.task}</h2>
                        </Link>
                        <Link to={`../overview/projects/${timer.projectId}`}>
                          {timer.projectName}
                        </Link>
                        <p>
                            {format(new Date(timer.start), 'HH:mm:ss')} till{' '}
                            {format(
                              timer.end.length
                                ? new Date(timer.end)
                                : new Date(),
                              'HH:mm:ss'
                            )}
                        </p>
                        <p>{timeString(timer.timeInSpan)}</p>
                        <fetcher.Form
                          method="post"
                          action={`../timers/${timer.id}/destroy`}
                          onSubmit={(e) => {
                            if (
                              !confirm('Vill du verkligen ta bort denna timer?')
                            ) {
                              e.preventDefault()
                            }
                          }}
                        >
                          <button name="delete" className={styles.button}>
                            Ta bort
                          </button>
                        </fetcher.Form>
                      </ListContent>
                    ))}
                </List>
              </div>
            )}
          </div>
        ))}
    </>
  )
}
