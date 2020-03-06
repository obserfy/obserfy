import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import { text } from "@storybook/addon-knobs"
import ObservationCard from "./ObservationCard"

export default {
  title: "Core|ObservationCard",
  component: ObservationCard,
  parameters: {
    componentSubtitle: "Just a simple ObservationCard",
  },
}

export const Basic: FC = () => (
  <ObservationCard
    observation={{
      studentName: "Angelica",
      createdDate: text("date", "2019-12-10T11:53:02.050339Z"),
      id: "",
      studentId: "",
      longDesc: "",
      categoryId: "0",
      shortDesc: "",
    }}
    onDelete={action("delete")}
    onEdit={action("edit")}
  />
)
