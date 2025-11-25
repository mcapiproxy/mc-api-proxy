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
    return c.text(`A ${c.req.header("content-type")}`)
  } catch {
    try {
      body = await c.req.json()
      return c.text(`B ${c.req.header("content-type")}`)
    } catch { 
      try {
        body = await c.req.parseBody()
        return c.text(`C ${c.req.header("content-type")}`)
      } catch {}
    }
  }
  return c.text(`D ${c.req.header("content-type")}`)

  // if (body)
  //   reqInit.body = body

  // const res = await fetch(`https://api.minecraftservices.com/minecraft/${endpoint}`, reqInit)
  // return res
})

export default app
