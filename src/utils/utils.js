import { eachDayOfInterval, compareDesc } from 'date-fns'

export function totalTime(timers) {
  const a = timers?.length ? timers : [timers]
  const res = a.reduce((total, timer) => {
    return timer.end.length
      ? total + Math.round((new Date(timer.end) - new Date(timer.start)) / 1000)
      : total + Math.round((new Date() - new Date(timer.start)) / 1000)
  }, 0)
  return res
}

export function totalTimeToday(timers) {
  const today = new Date().toDateString()
  const res = timers.reduce((total, timer) => {
    const start = new Date(timer.start)
    const end = new Date(timer.end)
    if (start.toDateString() === today) {
      return timer.end.length
        ? total + Math.round((end - start) / 1000)
        : total + Math.round((new Date() - start) / 1000)
    } else if (end.toDateString() === today) {
      return total + Math.round((end - new Date(today)) / 1000)
    } else if (!timer.end.length) {
      return total + Math.round((new Date() - new Date(today)) / 1000)
    }
    return total
  }, 0)
  return res
}

export function datesBetween(start, end) {
  return eachDayOfInterval({ start, end })
    .sort(compareDesc)
    .map((date) => date.toDateString())
}

export function distanceDays(start, end) {
  return Math.round((endDate - startDate) / 86400000)
}

export function timeBetween(start, end, spanStart, spanEnd) {
  const startingPoint = start > spanStart ? start : spanStart
  if (startingPoint > spanEnd) {
    return 0
  }
  const endingPoint = end < spanEnd ? end : spanEnd
  if (endingPoint < spanStart) {
    return 0
  }
  return Math.round((endingPoint - startingPoint) / 1000)
}

export function totalForDay(start, end, day) {
  const startD = start.toDateString()
  const endD = end.toDateString()
  const dayD = day.toDateString()

  if (startD !== dayD) {
    if (endD !== dayD) return 86400
    return Math.round((end - day) / 1000)
  }

  if (endD !== dayD) return 86400 - Math.round((start - day) / 1000)

  return Math.round((end - start) / 1000)
}

export function timeString(seconds) {
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  // const days = Math.round(hours / 24)
  let string = ''
  string += seconds > 36000 ? hours : seconds > 3600 ? `0 ${hours}` : '00'
  string += ':'
  string +=
    minutes % 60 > 9
      ? minutes % 60
      : minutes % 60 > 0
      ? `0${minutes % 60}`
      : '00'
  string += ':'
  string +=
    seconds % 60 > 9
      ? seconds % 60
      : seconds % 60 > 0
      ? `0${seconds % 60}`
      : '00'
  return string
}
