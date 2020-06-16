import React, { FC } from "react"
import { BoxProps } from "theme-ui"
import Pill from "../Pill/Pill"
import { GuardianRelationship } from "../../api/students/usePostNewStudent"

interface Props extends BoxProps {
  relationship: GuardianRelationship
}
export const GuardianRelationshipPill: FC<Props> = ({
  relationship,
  ...props
}) => (
  <Pill
    {...props}
    {...(() => {
      switch (relationship) {
        case GuardianRelationship.Father:
          return { text: "Father", backgroundColor: "orange" }
        case GuardianRelationship.Mother:
          return {
            text: "Mother",
            backgroundColor: "primary",
            color: "onPrimary",
          }
        case GuardianRelationship.Other:
          return {
            text: "Other",
            backgroundColor: "",
            color: "onSurface",
          }
        default:
          return {
            text: "N/A",
            backgroundColor: "",
            color: "onSurface",
          }
      }
    })()}
  />
)

export default GuardianRelationshipPill
