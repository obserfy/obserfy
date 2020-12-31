import dayjs from "../../../dayjs"
import { getSchoolId } from "../../schoolIdState"
import { BASE_URL } from "../useApi"

export async function useExportObservation(
  studentId: string,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  search: string
) {
  console.log("export func")
  const res = await fetch(
    `${BASE_URL}/exports/${getSchoolId()}/observations?&studentId=${studentId}&search=${search}&startDate=${startDate}&endDate=${endDate}`
  )

  const blob = new Blob([await res.blob()], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.setAttribute("hidden", "")
  a.setAttribute("href", url)
  a.setAttribute("download", "download.csv")
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
