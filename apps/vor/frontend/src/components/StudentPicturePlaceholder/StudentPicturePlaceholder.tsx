/** @jsx jsx */
import { StaticImage } from "gatsby-plugin-image"
import { jsx } from "theme-ui"
import { FC } from "react"

export const StudentPicturePlaceholder: FC = () => (
  <StaticImage
    src="../../images/gradients/1.jpg"
    alt="empty student photo"
    maxWidth={32}
    sx={{ borderRadius: "circle" }}
    className={"test"}
  />
)

export default StudentPicturePlaceholder
