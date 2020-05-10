import React, { FC } from "react"
import { PageProps } from "gatsby"
import SEO from "../../../../../components/seo"
import PageNewStudent from "../../../../../components/PageNewStudent/PageNewStudent"
import { GuardianRelationship } from "../../../../../api/students/usePostNewStudent"

const NewStudent: FC<PageProps> = ({ location }) => {
  return (
    <>
      <SEO title="Edit Student" />
      <PageNewStudent
        newGuardian={
          (location.state as {
            guardian?: {
              id: string
              relationship: GuardianRelationship
            }
          })?.guardian
        }
      />
    </>
  )
}
export default NewStudent
