import { t } from "@lingui/macro"
import React from "react"
import { Box } from "theme-ui"
import BackNavigation from "../../../../components/BackNavigation/BackNavigation"
import { useQueryString } from "../../../../hooks/useQueryString"
import PageGuardianProfile from "../../../../components/PageGuardianProfile/PageGuardianProfile"
import { ADMIN_GUARDIAN_URL } from "../../../../routes"

const GuardianProfile = () => {
  const id = useQueryString("id")

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <BackNavigation to={ADMIN_GUARDIAN_URL} text={t`All Guardians`} />
      <PageGuardianProfile guardianId={id} />
    </Box>
  )
}

export default GuardianProfile
