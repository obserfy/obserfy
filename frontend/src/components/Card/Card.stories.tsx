import React, { FC } from "react"

import Card from "./Card"
import Typography from "../Typography/Typography"
import { generateFluidObject } from "../../__mocks__/data"
import { Image } from "../Image/Image"

export default {
  title: "Core|Card",
  component: Card,
  parameters: {
    componentSubtitle: "Just a simple Card",
  },
}

export const Basic: FC = () => (
  <Card m={2}>
    <Image height={400} src={generateFluidObject().src} />
    <Typography.H4 mx={4} mt={4}>
      Par example
    </Typography.H4>
    <Typography.Body m={4}>
      Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      Lorem Ipsum has been the industry standard dummy text ever since the
      1500s, when an unknown printer took a galley of type and scrambled it to
      make a type specimen book.
    </Typography.Body>
  </Card>
)
