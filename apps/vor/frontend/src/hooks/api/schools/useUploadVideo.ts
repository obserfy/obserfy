import { createUpload } from "@mux/upchunk"
import { useMutation } from "react-query"
import { navigate } from "../../../components/Link/Link"
import { getSchoolId } from "../../schoolIdState"
import { BASE_URL } from "../useApi"

const uploadFile = (file: File, url: string) => {
  return new Promise<void>((resolve, reject) => {
    const upload = createUpload({
      file,
      endpoint: url,
    })

    upload.on("success", () => {
      resolve()
    })

    upload.on("error", (err) => {
      reject(err)
    })
  })
}

const postCreateUploadLink = async (file: File) => {
  const result = await fetch(
    `${BASE_URL}/schools/${getSchoolId()}/videos/upload`,
    {
      credentials: "same-origin",
      method: "POST",
    }
  )

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
    throw Error("unauthorized")
  }

  const body = await result.json()
  if (!result.ok) {
    analytics.track("Request Failed", {
      method: "POST",
      status: result.status,
      message: body?.error?.message,
    })
    throw Error(body?.error?.message ?? "")
  }

  await uploadFile(file, body.url)
}

export const useUploadVideo = () => {
  return useMutation(postCreateUploadLink)
}
