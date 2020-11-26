import auth0 from "../../../utils/auth0"
import { findChildrenByGuardianEmail } from "../../../db/queries"
import logger from "../../../logger"

export interface UserData {
  family_name: string
  given_name: string
  locale: string
  name: string
  nickname: string
  picture: string
  sub: string
  updated_at: string
  email: string
  email_verified: boolean
  children: Array<{
    id: string
    name: string
    schoolName: string
  }>
}

export default auth0.requireAuthentication(async function me(req, res) {
  try {
    const session = await auth0.getSession(req)
    if (!session) {
      res.status(401).end("unauthorized")
      return
    }
    const result = await findChildrenByGuardianEmail(session.user.email)

    res.json({
      ...session.user,
      children: result.map(({ id, name, school_name }) => ({
        id,
        name,
        schoolName: school_name,
      })),
    } as UserData)
  } catch (error) {
    logger.error(error)
    res.status(error.status || 500).end(error.message)
  }
})
