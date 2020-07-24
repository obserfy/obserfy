import React, { FC } from "react"
import PageGuardianProfile from "./PageGuardianProfile"

export default {
  title: "Core|PageGuardianProfile",
  component: PageGuardianProfile,
  parameters: {
    componentSubtitle: "Just a simple PageGuardianProfile",
  },
}

export const Basic: FC = () => <PageGuardianProfile guardianId="test" />
