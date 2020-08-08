import React, { FC } from "react"
import PageGallery from "./PageGallery"

export default {
  title: "Core|PageGallery",
  component: PageGallery,
  parameters: {
    componentSubtitle: "Just a simple PageGallery",
  },
}

export const Basic: FC = () => <PageGallery id="asdasd" />
