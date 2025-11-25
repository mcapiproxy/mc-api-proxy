import { Hono } from 'hono'

const app = new Hono()

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
      } catch { }
    }
  }

  if (body)
    reqInit.body = body

  const res = await fetch(`https://api.minecraftservices.com/minecraft/${endpoint}`, reqInit)
  return res
})

export default app
