import { getSession } from "@auth0/nextjs-auth0"
import { findChildrenByGuardianEmail } from "../db/queries"

export const getUser = async () => {
  const session = await getSession()
  if (!session) return null

  const result = await findChildrenByGuardianEmail(session.user.email)

  return {
    ...session.user,
    children: result.map(({ id, name, school_name }) => ({
      id,
      name,
      schoolName: school_name,
    })),
  }
}
