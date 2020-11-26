import auth0 from "../../utils/auth0"
import { apiRoute } from "../../utils/rest"

const logout = apiRoute(async (req, res) => {
  await auth0.handleLogout(req, res)
})

export default logout
