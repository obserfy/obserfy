import React, { FC } from "react"
import { Helmet } from "react-helmet"

interface Props {
  title: string
}
const SEO: FC<Props> = ({ title }) => {
  const titleTemplate = `Vor | %s`

  return (
    <Helmet title={title} titleTemplate={titleTemplate}>
      <html lang="en" />
    </Helmet>
  )
}

export default SEO
