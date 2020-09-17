import React, { FC } from "react"
import BrandBanner from "./BrandBanner"

export default {
  title: "Core/BrandBanner",
  component: BrandBanner,
  parameters: {
    componentSubtitle: "Just a simple BrandBanner",
  },
}

export const Basic: FC = () => <BrandBanner />
