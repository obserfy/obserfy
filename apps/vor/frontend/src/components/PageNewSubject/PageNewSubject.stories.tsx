import React, { FC } from "react"
import PageNewSubject from "./PageNewSubject"

export default {
  title: "Page|PageNewSubject",
  component: PageNewSubject,
  parameters: {
    componentSubtitle: "Just a simple PageNewSubject",
  },
}

export const Basic: FC = () => <PageNewSubject areaId="sadf" />
