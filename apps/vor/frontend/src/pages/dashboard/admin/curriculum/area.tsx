import React, { FC } from "react"
import queryString from "query-string"
import { PageRendererProps } from "gatsby"
import SEO from "../../../../components/seo"
import PageCurriculumArea from "../../../../components/PageCurriculumArea/PageCurriculumArea"

const Settings: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let id: string
  if (Array.isArray(query?.id)) {
    id = query?.id[0] ?? ""
  } else {
    id = query?.id ?? ""
  }

  return (
    <>
      <SEO title="Settings" />
      <PageCurriculumArea id={id} />
    </>
  )
}

export default Settings
