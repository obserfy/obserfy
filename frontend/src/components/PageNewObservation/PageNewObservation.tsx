import React, { FC, FormEvent, useState } from "react"
import { categories } from "../../categories"
import Box from "../Box/Box"
import Select from "../Select/Select"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Flex from "../Flex/Flex"
import Button from "../Button/Button"
import BackNavigation from "../BackNavigation/BackNavigation"
import Spacer from "../Spacer/Spacer"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { getAnalytics } from "../../analytics"
import { createObservationApi } from "../../api/createObservationApi"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

interface Props {
  studentId: string
}
export const PageNewObservation: FC<Props> = ({ studentId }) => {
  const [shortDesc, setShortDesc] = useState("")
  const [longDesc, setDetails] = useState("")
  const [category, setCategory] = useState(categories[0].id)
  const [submitting, setSubmitting] = useState(false)
  const student = useGetStudent(studentId)

  async function submit(e: FormEvent): Promise<void> {
    e.preventDefault()
    setSubmitting(true)
    const response = await createObservationApi(studentId, {
      categoryId: category,
      longDesc,
      shortDesc,
    })

    if (response.status === 201) {
      getAnalytics()?.track("Observation Created", {
        responseStatus: response.status,
      })
      window.history?.back()
    } else {
      getAnalytics()?.track("Create Observation Failed", {
        responseStatus: response.status,
      })
      setSubmitting(false)
    }
  }

  return (
    <Box maxWidth="maxWidth.sm" margin="auto" pb={4}>
      <BackNavigation
        to={`/dashboard/observe/students/details?id=${studentId}`}
        text="Student Detail"
      />
      {student.isFetching && student.data === undefined ? (
        <Box pb={4} pt={3} px={3}>
          <LoadingPlaceholder width="100%" height="4rem" />
        </Box>
      ) : (
        <Typography.H6 pb={4} pt={3} px={3}>
          {student.data?.name}
        </Typography.H6>
      )}
      <Box as="form" px={3} onSubmit={submit}>
        <Input
          autoFocus
          label="Short Description"
          width="100%"
          placeholder="What have you found?"
          onChange={(e) => setShortDesc(e.target.value)}
          value={shortDesc}
          mb={3}
        />
        <TextArea
          height={150}
          label="Details"
          width="100%"
          fontSize={2}
          placeholder="Tell us what you observed"
          onChange={(e) => setDetails(e.target.value)}
          value={longDesc}
          mb={3}
        />
        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
        <Flex pt={3}>
          <Spacer />
          <Button disabled={shortDesc === ""}>
            {submitting && <LoadingIndicator />}
            Add
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}

export default PageNewObservation
