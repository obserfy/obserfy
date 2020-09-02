import React, { FC } from "react"
import Avatar from "./Avatar"
import { generateFluidObject } from "../../__mocks__/data"

export default {
  title: "Basic/Avatar",
  component: Avatar,
  parameters: {
    componentSubtitle: "Just a simple Avatar",
  },
}

export const Basic: FC = () => <Avatar source={generateFluidObject().src} />
