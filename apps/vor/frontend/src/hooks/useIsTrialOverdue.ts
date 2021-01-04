import { useEffect, useState } from "react"
import dayjs from "../dayjs"
import { useGetSchool } from "./api/schools/useGetSchool"

export function isTrialOverdue(
  createdAt: string,
  subscription?: {
    id: string
    cancelUrl: string
    nextBillDate: string
    status: string
    updateUrl: string
  }
) {
  const today = dayjs()
  const schoolCreationDate = dayjs(createdAt)
  return (
    subscription === undefined && today.diff(schoolCreationDate, "month") > 0
  )
}

const useIsTrialOverdue = () => {
  const school = useGetSchool()
  const [trialOverdue, setTrialsOverdue] = useState(false)

  useEffect(() => {
    if (school.isSuccess) {
      setTrialsOverdue(
        isTrialOverdue(school.data.createdAt, school.data.subscription)
      )
    }
  }, [school.data?.createdAt, school.data?.subscription, school.isSuccess])

  return trialOverdue
}

export default useIsTrialOverdue
