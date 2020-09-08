import React, { FC } from "react"
import PageNewGuardian from "../../../../../components/PageNewGuardian/PageNewGuardian"
import { useQueryString } from "../../../../../hooks/useQueryString"

const NewGuardians: FC = () => {
  const id = useQueryString("studentId")

  return <PageNewGuardian id={id} />
}

export default NewGuardians
