import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server"
import { findChildrenByGuardianEmail } from "../../../db/queries"

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

export const GET = withApiAuthRequired(async (req: Request) => {
  const session = await getSession()
  if (!session) {
    return new NextResponse("unauthorized", { status: 401 })
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

  return NextResponse.json(response)
})
