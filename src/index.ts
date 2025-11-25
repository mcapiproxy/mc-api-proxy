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

  if (c.req.raw.body !== null)
    reqInit.body = c.req.raw.body

  const res = await fetch(`https://api.minecraftservices.com/minecraft/${endpoint}`, reqInit)
  return res
})

export default app
