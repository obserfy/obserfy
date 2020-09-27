import React, { FC } from "react"
import { Box } from "theme-ui"
import { i18nMark } from "@lingui/core"
import InformationalCard from "../InformationalCard/InformationalCard"
import { CLASS_SETTINGS_URL } from "../../routes"

export const EmptyClassDataPlaceholder: FC = () => (
  <Box mx={[0, 3]}>
    <InformationalCard
      buttonText={i18nMark("Go to Class Settings")}
      message={i18nMark(
        "Create your first class to track your student's class enrollment."
      )}
      to={CLASS_SETTINGS_URL}
    />
  </Box>
)

export default EmptyClassDataPlaceholder
