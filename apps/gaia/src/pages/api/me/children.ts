import { findChildrenByGuardianEmail } from "../../../db/queries"
import auth0 from "../../../utils/auth0"
import { protectedApiRoute } from "../../../utils/rest"

export interface GetChildrenResponse {
  id: string
  name: string
}
const childrenHandler = protectedApiRoute(async (req, res) => {
  const session = await auth0.getSession(req)
  if (!session) {
    res.status(401).end("unauthorized")
    return
  }

  const result = await findChildrenByGuardianEmail(session.user.email)
  res.status(200).json(result)
})

export default childrenHandler
