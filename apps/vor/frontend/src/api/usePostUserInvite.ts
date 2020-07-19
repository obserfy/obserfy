import { MutationResultPair, useMutation } from "react-query"
import { getSchoolId } from "../hooks/schoolIdState"
import { postApi } from "./fetchApi"

interface Payload {
  email: Array<string>
}
export const usePostUserInvite = (): MutationResultPair<
  Response,
  Payload,
  Error
> => {
  const sendInvite = postApi<Payload>(`/schools/${getSchoolId()}/invite-user`)
  return useMutation(sendInvite)
}
