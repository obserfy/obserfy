import { findRelatedStudents } from "$lib/db"
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0"
import { NextResponse } from "next/server"
import { generateOriginalUrl } from "../../../../utils/imgproxy"

export interface GetChildrenResponse {
  id: string
  name: string
  profilePic: string
}

export const GET = withApiAuthRequired(async (req: Request) => {
  const session = await getSession()
  if (!session) {
    return new NextResponse("unauthorized", { status: 401 })
  }

  const students = await findRelatedStudents(session.user.email)
  return NextResponse.json(
    students.map((student) => ({
      id: student.id,
      name: student.name,
      profilePic: student.images?.object_key
        ? generateOriginalUrl(student.images.object_key)
        : null,
    }))
  )
})
