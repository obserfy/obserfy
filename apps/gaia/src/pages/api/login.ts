import { NextApiHandler } from "next"
import auth0 from "../../utils/auth0"
import { apiRoute } from "../../utils/rest"

const login: NextApiHandler = apiRoute(async (req, res) => {
  const session = await auth0.getSession(req)
  if (session) {
    res.setHeader("Location", "/")
    res.status(302).end()
    return
  }
  await auth0.handleLogin(req, res)
})

export default login
