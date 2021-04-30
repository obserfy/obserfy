import dayjs from "./dayjs"
import { BASE_URL } from "./hooks/api/useApi"
import { getSchoolId } from "./hooks/schoolIdState"

export async function exportStudentObservations(
  studentId: string,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs,
  search: string,
  studentName: string
) {
  const res = await fetch(
    `${BASE_URL}/exports/${getSchoolId()}/observations?&studentId=${studentId}&search=${search}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
  )

  const blob = new Blob([await res.blob()], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.setAttribute("hidden", "")
  a.setAttribute("href", url)
  a.setAttribute(
    "download",
    `${studentName}_${startDate.format("DD-MMM-YY")}_${endDate.format(
      "YYYY-MM-DD"
    )}.csv`
  )
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export async function exportMaterialProgressCsv(
  studentId: string,
  studentName: string
) {
  const res = await fetch(
    `${BASE_URL}/students/${studentId}/materialsProgress/export/csv`
  )

  const blob = new Blob([await res.blob()], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")

  a.setAttribute("hidden", "")
  a.setAttribute("href", url)
  a.setAttribute(
    "download",
    `${studentName.toLowerCase().replace(" ", "-")}-${dayjs().format(
      "YYYY-MM-DD"
    )}.csv`
  )
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
