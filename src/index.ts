import { Hono } from 'hono'
import { cors } from 'hono/cors';

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
  try {
    body = await c.req.text()
  } catch {
    try {
      body = await c.req.formData()
    } catch { 
      try {
        body = await c.req.json()
      } catch { 
        try {
          body = await c.req.blob()
        } catch {}
      }
    }
  }

  if (body)
    reqInit.body = body

  const res = await fetch(`https://api.minecraftservices.com/minecraft/${endpoint}`, reqInit)
  return res
})

export default app
