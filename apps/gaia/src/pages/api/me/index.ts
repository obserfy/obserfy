import auth0 from "../../../utils/auth0"
import { findChildrenByGuardianEmail } from "../../../db"

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
    const { user } = await auth0.getSession(req)
    const result = await findChildrenByGuardianEmail(user.email)

    res.json({
      ...user,
      children: result.map(({ id, name, school_name }) => ({
        id,
        name,
        schoolName: school_name,
      })),
    } as UserData)
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
})
