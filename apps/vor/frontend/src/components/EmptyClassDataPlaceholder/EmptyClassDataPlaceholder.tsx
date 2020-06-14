import React, { FC } from "react"
import Box from "../Box/Box"
import InformationalCard from "../InformationalCard/InformationalCard"
import { CLASS_SETTINGS_URL } from "../../routes"

export const EmptyClassDataPlaceholder: FC = () => (
  <Box mx={[0, 3]}>
    <InformationalCard
      buttonText="Go to Class Settings"
      message="Create your first class to track your student's class enrollment."
      to={CLASS_SETTINGS_URL}
    />
  </Box>
)

export default EmptyClassDataPlaceholder
