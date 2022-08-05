import { PageProps } from "gatsby"
import { FC } from "react"
import PageNewStudent from "../../../../components/PageNewStudent/PageNewStudent"
import SEO from "../../../../components/seo"

const NewStudent: FC<PageProps> = () => {
  return (
    <>
      <SEO title="Edit Student" />
      <PageNewStudent />
    </>
  )
}
export default NewStudent
