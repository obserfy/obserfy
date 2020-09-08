import React from "react"
import { useQueryString } from "../../../../hooks/useQueryString"
import PageGuardianProfile from "../../../../components/PageGuardianProfile/PageGuardianProfile"

const GuardianProfile = () => {
  const id = useQueryString("studentId")

  return <PageGuardianProfile guardianId={id} />
}

export default GuardianProfile
