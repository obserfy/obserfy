import Head from "next/head"
import { FC } from "react"

const SEO: FC<{
  title: string
}> = ({ title }) => {
  const fullTitle = `${title} | Obserfy for Parents`
  return (
    <Head>
      <title>{fullTitle}</title>
    </Head>
  )
}

export default SEO
