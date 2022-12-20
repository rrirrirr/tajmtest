import { fetch, Request, Response } from '@remix-run/web-fetch'

if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Request = Request
  globalThis.Response = Response
}
