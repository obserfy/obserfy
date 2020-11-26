import auth0 from "../../utils/auth0"
import { apiRoute } from "../../utils/rest"

const loginCallback = apiRoute(async (req, res) => {
  await auth0.handleCallback(req, res)
})

export default loginCallback
