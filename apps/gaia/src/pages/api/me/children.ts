import { findChildrenByGuardianEmail } from "../../../db/queries"
import auth0 from "../../../utils/auth0"

export interface GetChildrenResponse {
  id: string
  name: string
}
const childrenHandler = auth0.requireAuthentication(async (req, res) => {
  try {
    const session = await auth0.getSession(req)
    if (!session) {
      res.status(401).end("unauthorized")
      return
    }

    const result = await findChildrenByGuardianEmail(session.user.email)
    res.status(200).json(result)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
})

export default childrenHandler
