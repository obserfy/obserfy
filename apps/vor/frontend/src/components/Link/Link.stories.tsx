import React, { FC } from "react"
import { Link } from "./Link"

export default {
  title: "Core|Link",
  component: Link,
  parameters: {
    componentSubtitle: "Just a simple Link",
  },
}

export const Basic: FC = () => <Link to="/somewhere" />
