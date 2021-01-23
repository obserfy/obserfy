import { StaticImage } from "gatsby-plugin-image"
import React, { FC } from "react"

export const StudentPicturePlaceholder: FC = () => (
  <StaticImage
    src="../../images/gradients/1.jpg"
    alt="empty student photo"
    width={32}
    className="rounded-full"
  />
)

export default StudentPicturePlaceholder
