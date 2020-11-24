import { useQuery } from "react-query"

interface GetInviteCodeDetailsResponse {
  schoolName: string
}
const useGetInviteCodeDetails = (inviteCode?: string) => {
  const getInviteCodeDetails = async (): Promise<GetInviteCodeDetailsResponse> => {
    const result = await fetch(`/auth/invite-code/${inviteCode}`, {
      credentials: "same-origin",
    })

    if (!result.ok) {
      const response = await result.json()
      throw Error(response.error.message)
    }

    // Parse json
    return result.json()
  }

  return useQuery(["invite-code", inviteCode], getInviteCodeDetails, {
    enabled: inviteCode,
  })
}

export default useGetInviteCodeDetails
