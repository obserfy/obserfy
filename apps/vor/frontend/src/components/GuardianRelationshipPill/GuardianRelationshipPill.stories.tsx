import React, { FC } from "react"
import GuardianRelationshipPill from "./GuardianRelationshipPill"

export default {
  title: "Core/GuardianRelationshipPill",
  component: GuardianRelationshipPill,
  parameters: {
    componentSubtitle: "Just a simple GuardianRelationshipPill",
  },
}

export const Basic: FC = () => <GuardianRelationshipPill relationship={0} />
