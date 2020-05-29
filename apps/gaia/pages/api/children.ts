import { queryChildrenByGuardianEmail } from "../../db"
import auth0 from "../../utils/auth0"

const childrenHandler = auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req)

    const result = await queryChildrenByGuardianEmail(user.email)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
})

export default childrenHandler
