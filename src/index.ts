import { Hono } from 'hono'
import { cors } from 'hono/cors';
import { parse } from 'hono/utils/cookie';

const app = new Hono()

app.use("*", cors({
  origin: "*",
}))

app.all("/:endpoint{.+}", async (c) => {
  const endpoint = await c.req.param("endpoint")
  const reqInit: RequestInit = {
    method: c.req.method,
    headers: {
      ...c.req.header()
    }
  }

  let body = null
  const contentType = c.req.header("content-type") || ""
  if (contentType.includes("application/json")) {
    body = await c.req.json()
  } else if (contentType.includes("multipart/form-data")) {
    body = await c.req.formData()
  } else if (contentType.includes("application/x-www-form-urlencoded")) {
    body = await c.req.parseBody()
  } else if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    body = await c.req.text()
  }

  if (body)
    reqInit.body = body

  const res = await fetch(`https://api.minecraftservices.com/minecraft/${endpoint}`, reqInit)
  return res
})

export default app
