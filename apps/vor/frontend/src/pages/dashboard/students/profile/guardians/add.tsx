import { FC } from "react"
import PageAddGuardian from "../../../../../components/PageAddGuardian/PageAddGuardian"
import { useQueryString } from "../../../../../hooks/useQueryString"

const NewGuardians: FC = () => {
  const id = useQueryString("studentId")

  return <PageAddGuardian id={id} />
}

export default NewGuardians
