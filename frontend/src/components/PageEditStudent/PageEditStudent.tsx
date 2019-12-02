import React, { FC, useEffect, useState } from "react"
import { navigate } from "gatsby"
import Box from "../Box/Box"
import { useQueryStudentDetails } from "../../hooks/students/useQueryStudentDetails"
import Input from "../Input/Input"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import BackNavigation from "../BackNavigation/BackNavigation"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

interface Props {
  id: string
}
export const PageEditStudent: FC<Props> = ({ id }) => {
  const [details] = useQueryStudentDetails(id)
  const [name, setName] = useState()

  useEffect(() => {
    setName(details?.name)
  }, [details])

  async function deleteStudent(): Promise<void> {
    const baseUrl = "/api/v1"

    const response = await fetch(`${baseUrl}/students/${id}`, {
      credentials: "same-origin",
      method: "DELETE",
    })

    if (response.status === 200) {
      navigate("/")
    }
  }

  return (
    <Box>
      <BackNavigation to={`/students/details?id=${id}`} text="Details" />
      <Box mx={3}>
        {details?.name ? (
          <Input
            label="Name"
            width="100%"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        ) : (
          <LoadingPlaceholder width="100%" height={60} />
        )}
      </Box>
      <Flex m={3}>
        <Button mr={3} variant="outline" color="danger" onClick={deleteStudent}>
          Delete
        </Button>
        <Button>Save</Button>
      </Flex>
    </Box>
  )
}

export default PageEditStudent
