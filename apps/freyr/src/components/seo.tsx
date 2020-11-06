/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from "react"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"
import { useLingui } from "@lingui/react"

interface Props {
  description?: string
  lang?: string
  meta?: JSX.IntrinsicElements["meta"][]
  title: string
}

const SEO: FC<Props> = ({
  title,
  lang = `en`,
  meta = [],
  description = ``,
}) => {
  const { i18n } = useLingui()
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={i18n._(title)}
      titleTemplate={`%s - ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: i18n._(metaDescription),
        },
        {
          property: `og:title`,
          content: i18n._(title),
        },
        {
          property: `og:description`,
          content: i18n._(metaDescription),
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: i18n._(title),
        },
        {
          name: `twitter:description`,
          content: i18n._(metaDescription),
        },
        ...meta,
      ]}
    />
  )
}

export default SEO
