import auth0 from "../../../utils/auth0"
import { findChildrenByGuardianEmail } from "../../../db/queries"
import { protectedApiRoute } from "../../../utils/rest"

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

const me = protectedApiRoute(async (req, res) => {
  const session = await auth0.getSession(req)
  if (!session) {
    res.status(401).end("unauthorized")
    return
  }
  const result = await findChildrenByGuardianEmail(session.user.email)

  const response = {
    ...session.user,
    children: result.map(({ id, name, school_name }) => ({
      id,
      name,
      schoolName: school_name,
    })),
  } as UserData
  res.json(response)
})

export default me
