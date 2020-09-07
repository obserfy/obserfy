import React, { FC, FormEvent, useState } from "react"
import { Box, Button } from "theme-ui"
import { categories } from "../../categories"
import Select from "../Select/Select"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import usePostNewObservation from "../../api/usePostNewObservation"
import { STUDENT_OVERVIEW_PAGE_URL } from "../../routes"
import BackNavigation from "../BackNavigation/BackNavigation"

interface Props {
  studentId: string
}
export const PageNewObservation: FC<Props> = ({ studentId }) => {
  const [postNewObservation, { isLoading }] = usePostNewObservation(studentId)

  const [shortDesc, setShortDesc] = useState("")
  const [longDesc, setDetails] = useState("")
  const [category, setCategory] = useState(categories[0].id)

  async function submit(e: FormEvent): Promise<void> {
    e.preventDefault()
    const response = await postNewObservation({
      categoryId: category,
      longDesc,
      shortDesc,
    })

    if (response.ok) {
      analytics.track("Observation Created")
      window.history?.back()
    } else {
      analytics.track("Create Observation Failed", {
        responseStatus: response.status,
      })
    }
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4}>
      <BackNavigation
        to={STUDENT_OVERVIEW_PAGE_URL(studentId)}
        text="Student Detail"
      />
      <StudentName id={studentId} />
      <Box as="form" px={3} onSubmit={submit}>
        <Select
          autoFocus
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          mb={3}
        >
          {categories.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </Select>
        <Input
          label="Short Description"
          sx={{ width: "100%" }}
          placeholder="What have you found?"
          onChange={(e) => setShortDesc(e.target.value)}
          value={shortDesc}
          mb={3}
        />
        <TextArea
          label="Details"
          placeholder="Tell us what you observed"
          onChange={(e) => setDetails(e.target.value)}
          value={longDesc}
          mb={3}
        />
        <Button disabled={shortDesc === ""} ml="auto">
          {isLoading && <LoadingIndicator />} Add
        </Button>
      </Box>
    </Box>
  )
}

const StudentName: FC<{ id: string }> = ({ id }) => {
  const { data, isLoading } = useGetStudent(id)

  if (isLoading && data === undefined) {
    return (
      <Box pb={4} pt={3} px={3}>
        <LoadingPlaceholder sx={{ width: "16rem", height: 27 }} />
      </Box>
    )
  }

  return (
    <Typography.H6 pb={4} pt={3} px={3}>
      {data?.name}
    </Typography.H6>
  )
}

export default PageNewObservation
