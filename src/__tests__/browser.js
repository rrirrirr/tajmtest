// @ts-check
import { rest, setupWorker } from 'msw'

import data from './data.js'

const handlers = [
  rest.get('http://localhost:3000/test', (req, res, ctx) => {
    return res(ctx.json(data))
  }),
  rest.get('http://localhost:3000/timelogs', (req, res, ctx) => {
    return res(ctx.json(data.timelogs))
  }),
  rest.get('http://localhost:3000/timelogs/:id', (req, res, ctx) => {
    const { timerId } = req.params
    return res(ctx.json(data.timelogs))
  }),
  rest.delete('http://localhost:3000/timelogs/:timerId', (req, res, ctx) => {
    const { timerId } = req.params
    data.timelogs = data.timelogs.filter((t) => t.id !== timerId)
    return res(ctx.json(data.timelogs))
  }),
  rest.get('http://localhost:3000/users', (req, res, ctx) => {
    return res(ctx.json(data.users))
  }),
  rest.get('http://localhost:3000/users/:id', (req, res, ctx) => {
    return res(ctx.json(data.users))
  }),
  rest.get('http://localhost:3000/projects', (req, res, ctx) => {
    return res(ctx.json(data.projects))
  }),
  rest.get('http://localhost:3000/projects/:id', (req, res, ctx) => {
    return res(ctx.json(data.projects))
  }),
  rest.get('http://localhost:3000/tasks', (req, res, ctx) => {
    return res(ctx.json(data.tasks))
  }),
  rest.get('http://localhost:3000/tasks/:id', (req, res, ctx) => {
    return res(ctx.json(data.tasks))
  })
]

const server = setupWorker(...handlers)
