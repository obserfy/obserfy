import { NextApiHandler } from "next"
import auth0 from "../../utils/auth0"

const login: NextApiHandler = async (req, res) => {
  try {
    await auth0.handleLogin(req, res)
  } catch (error) {
    console.error(error)
    res.status(error.status || 400).end(error.message)
  }
}

export default login
