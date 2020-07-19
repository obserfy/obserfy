import React from "react"
import { useQueryString } from "../../../../../hooks/useQueryString"
import PageNewStudentClass from "../../../../../components/PageNewStudentClass/PageNewStudentClass"

const NewStudntClass = () => {
  const id = useQueryString("id")

  return <PageNewStudentClass id={id} />
}

export default NewStudntClass
