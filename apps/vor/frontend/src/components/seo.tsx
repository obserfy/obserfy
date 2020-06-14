import React, { FC } from "react"
import { Helmet } from "react-helmet"

interface Props {
  title: string
}
const SEO: FC<Props> = ({ title }) => {
  const titleTemplate = `Obserfy | %s`

  return (
    <Helmet title={title} titleTemplate={titleTemplate}>
      <html lang="en" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
    </Helmet>
  )
}

export default SEO
