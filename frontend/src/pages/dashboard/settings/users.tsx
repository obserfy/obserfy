import React, { FC } from "react"
import SEO from "../../../components/seo"
import { useTitle } from "../../../hooks/useTitle"
import PageUsers from "../../../components/PageUsers/PageUsers"

const Users: FC = () => {
  useTitle("Users")

  return (
    <>
      <SEO title="Settings" />
      <PageUsers />
    </>
  )
}

export default Users
