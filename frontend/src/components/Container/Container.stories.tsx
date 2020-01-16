import React, { FC } from "react"

import Container from "./Container"
import Box from "../Box/Box"

export default {
  title: "Core|Container",
  component: Container,
  parameters: {
    componentSubtitle: "Container component with maxWidth set",
  },
}

export const Basic: FC = () => (
  <Container>
    <Box width="100%" backgroundColor="primary" height="10rem" />
  </Container>
)
