import { useQuery } from "react-query"
import { getApi } from "./fetchApi"
import { getSchoolId } from "../hooks/schoolIdState"
import { GetSchoolResponse } from "./schools/useGetSchool"

interface GetUserResponse {
  id: string
  email: string
  name: string
}
export const useGetUserProfile = () => {
  const identify = async () => {
    const user = await getApi<GetUserResponse>("/users")()
    const school = await getApi<GetSchoolResponse>(
      `/schools/${getSchoolId()}`
    )()

    if (user && school) {
      analytics.identify(user.id, {
        name: user.name,
        email: user.email,
        school: school.name,
      })
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      school: {
        id: getSchoolId(),
        name: school.name,
      },
    }
  }

  return useQuery("identify", identify, {
    refetchOnWindowFocus: false,
  })
}
