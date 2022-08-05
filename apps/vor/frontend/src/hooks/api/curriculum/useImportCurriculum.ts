import { useMutation } from "react-query"
import { BASE_URL } from "../useApi"
import { getSchoolId } from "../../schoolIdState"

const useImportCurriculum = () => {
  const importCurriculum = async (csv: File) => {
    const payload = new FormData()
    payload.append("csvFile", csv)

    return fetch(`${BASE_URL}/schools/${getSchoolId()}/curriculums/import`, {
      credentials: "same-origin",
      method: "POST",
      body: payload,
    })
  }

  return useMutation(importCurriculum)
}

export default useImportCurriculum
