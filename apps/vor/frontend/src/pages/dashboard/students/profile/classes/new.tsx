import React from "react"
import { useQueryString } from "../../../../../hooks/useQueryString"
import PageNewStudentClass from "../../../../../components/PageNewStudentClass/PageNewStudentClass"

const NewStudentClass = () => {
  const id = useQueryString("studentId")

  return <PageNewStudentClass id={id} />
}

export default NewStudentClass
