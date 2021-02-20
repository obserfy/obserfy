import { useQuery } from "react-query"
import { identify } from "../../analytics"
import { getApi } from "./fetchApi"
import { getSchoolId } from "../schoolIdState"
import { GetSchoolResponse } from "./schools/useGetSchool"

interface GetUserResponse {
  id: string
  email: string
  name: string
}
export const useGetUserProfile = () => {
  const getUserProfile = async () => {
    const user = await getApi<GetUserResponse>("/users")()
    const school = await getApi<GetSchoolResponse>(
      `/schools/${getSchoolId()}`
    )()

    if (user && school) {
      identify(user.id, {
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

  return useQuery("identify", getUserProfile, {
    refetchOnWindowFocus: false,
  })
}
