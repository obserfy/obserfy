import React, { FC } from "react"
import ObservationCard from "./ObservationCard"

export default {
  title: "Basic/Card/ObservationCard",
  component: ObservationCard,
  parameters: {
    componentSubtitle: "Just a simple ObservationCard",
  },
}

export const Basic: FC = () => (
  <ObservationCard
    observation={{
      studentName: "Angelica",
      createdDate: "2019-12-10T11:53:02.050339Z",
      id: "",
      longDesc: "",
      categoryId: "0",
      shortDesc: "",
      images: [],
    }}
    detailsUrl=""
    studentId=""
  />
)
