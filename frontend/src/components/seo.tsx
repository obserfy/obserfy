import React, { FC } from "react"
import { Helmet } from "react-helmet-async"

interface Props {
  title: string
}
const SEO: FC<Props> = ({ title }) => {
  const titleTemplate = `Obserfy | %s`

  return (
    <Helmet title={title} titleTemplate={titleTemplate}>
      <html lang="en" />
    </Helmet>
  )
}

export default SEO
