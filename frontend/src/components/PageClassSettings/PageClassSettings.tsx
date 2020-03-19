import React, { FC } from "react"
import Box from "../Box/Box"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../pages/dashboard/settings"

export const PageClassSettings: FC = () => (
  <Box>
    <BackNavigation to={SETTINGS_URL} text="Settings" />
  </Box>
)

export default PageClassSettings
