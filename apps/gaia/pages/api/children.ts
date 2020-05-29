import { queryChildrenByGuardianEmail } from "../../db"
import auth0 from "../../utils/auth0"

const childrenHandler = auth0.requireAuthentication(async (req, res) => {
  try {
    // const user = await auth0.getSession(req)
    // TODO: Use user's real session's email after we authenticate app with google.
    const email = "chrsep@protonmail.com"

    const result = await queryChildrenByGuardianEmail(email)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
})

export default childrenHandler
