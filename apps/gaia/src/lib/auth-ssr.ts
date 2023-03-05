import { cookies } from "next/headers"

interface User {
  given_name: string
  family_name: string
  nickname: string
  name: string
  picture: string
  locale: string
  updated_at: string
  email: string
  email_verified: boolean
  sub: string
  sid: string
  children: Array<{
    id: string
    name: string
    schoolName: string
  }>
}

export const getUser = async (): Promise<User> => {
  const c = cookies()
  const user = await fetch(process.env.AUTH0_BASE_URL + `/api/me`, {
    headers: {
      cookie: c
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; "),
    },
  })
  return user.json()
}
