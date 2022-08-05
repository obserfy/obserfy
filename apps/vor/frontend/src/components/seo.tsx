import { useLingui } from "@lingui/react"
import { graphql, useStaticQuery } from "gatsby"
import { FC } from "react"
import { Helmet } from "react-helmet"

interface Props {
  description?: string
  meta?: JSX.IntrinsicElements["meta"][]
  title: string
}
const SEO: FC<Props> = ({ title, meta = [], description = `` }) => {
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
      htmlAttributes={{ lang: i18n.locale }}
      title={i18n._(title)}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
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
    >
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
      />
    </Helmet>
  )
}

export default SEO
