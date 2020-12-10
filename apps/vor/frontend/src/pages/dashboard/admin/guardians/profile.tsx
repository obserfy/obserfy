import React from "react"
import { Box } from "theme-ui"
import PageGuardianProfile from "../../../../components/PageGuardianProfile/PageGuardianProfile"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import { useQueryString } from "../../../../hooks/useQueryString"
import { ADMIN_GUARDIAN_URL, ADMIN_URL } from "../../../../routes"

const GuardianProfile = () => {
  const id = useQueryString("id")

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <TopBar
        breadcrumbs={[
          breadCrumb("Admin", ADMIN_URL),
          breadCrumb("All Guardians", ADMIN_GUARDIAN_URL),
          breadCrumb("Mario"),
        ]}
      />
      <PageGuardianProfile guardianId={id} />
    </Box>
  )
}

export default GuardianProfile
