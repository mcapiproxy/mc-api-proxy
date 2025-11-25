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
    return c.text("A")
  } catch {
    try {
      body = await c.req.json()
      return c.text("B")
    } catch { 
      try {
        body = await c.req.parseBody()
        return c.text("C")
      } catch {}
    }
  }
  return c.text("D")

  // if (body)
  //   reqInit.body = body

  // const res = await fetch(`https://api.minecraftservices.com/minecraft/${endpoint}`, reqInit)
  // return res
})

export default app
