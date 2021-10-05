import Head from "next/head"
import { FC } from "react"

const SEO: FC<{
  title: string
}> = ({ title }) => (
  <Head>
    <title>{title} | Obserfy for Parents</title>
  </Head>
)

export default SEO
