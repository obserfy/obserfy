import { createUpload } from "@mux/upchunk"
import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { navigate } from "../../../components/Link/Link"
import { getSchoolId } from "../../schoolIdState"
import { useGetStudentVideosCache } from "../students/useGetVideos"
import { BASE_URL } from "../useApi"

const uploadFile = (file: File, url: string) => {
  return new Promise<void>((resolve, reject) => {
    const upload = createUpload({
      file,
      endpoint: url,
      chunkSize: 20480,
    })

    upload.on("success", () => {
      resolve()
    })

    upload.on("error", (err) => {
      reject(err)
    })
  })
}

export const useUploadStudentVideo = (studentId: string) => {
  const cache = useGetStudentVideosCache(studentId)

  const postCreateUploadLink = async (file: File) => {
    const result = await fetch(
      `${BASE_URL}/schools/${getSchoolId()}/videos/upload`,
      {
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify({ studentId }),
      }
    )

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      throw Error("unauthorized")
    }

    const body = await result.json()
    if (!result.ok) {
      track("Request Failed", {
        method: "POST",
        status: result.status,
        message: body?.error?.message,
      })
      throw Error(body?.error?.message ?? "")
    }

    await uploadFile(file, body.url)
  }

  return useMutation(postCreateUploadLink, {
    onSuccess: () => {
      setTimeout(() => cache.refetchQueries(), 1000)
    },
  })
}
