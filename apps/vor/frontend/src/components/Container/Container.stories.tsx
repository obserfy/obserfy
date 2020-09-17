import React, { FC } from "react"

import { Box } from "theme-ui"
import Container from "./Container"

export default {
  title: "Core/Container",
  component: Container,
  parameters: {
    componentSubtitle: "Container component with maxWidth set",
  },
}

export const Basic: FC = () => (
  <Container>
    <Box sx={{ width: "100%", height: "10rem" }} backgroundColor="primary" />
  </Container>
)
