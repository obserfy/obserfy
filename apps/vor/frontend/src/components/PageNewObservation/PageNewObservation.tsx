import React, { FC, FormEvent, useState } from "react"
import { Box, Flex, Button } from "theme-ui"
import { categories } from "../../categories"
import Select from "../Select/Select"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"

import BackNavigation from "../BackNavigation/BackNavigation"
import Spacer from "../Spacer/Spacer"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

import { createObservationApi } from "../../api/createObservationApi"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import { STUDENT_OVERVIEW_PAGE_URL } from "../../routes"

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
      analytics.track("Observation Created", {
        responseStatus: response.status,
      })
      window.history?.back()
    } else {
      analytics.track("Create Observation Failed", {
        responseStatus: response.status,
      })
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4}>
      <BackNavigation
        to={STUDENT_OVERVIEW_PAGE_URL(studentId)}
        text="Student Detail"
      />
      {student.status === "loading" && student.data === undefined ? (
        <Box pb={4} pt={3} px={3}>
          <LoadingPlaceholder sx={{ width: "100%", height: "4rem" }} />
        </Box>
      ) : (
        <Typography.H6 pb={4} pt={3} px={3}>
          {student.data?.name}
        </Typography.H6>
      )}
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
          sx={{
            height: 150,
            fontSize: 2,
            width: "100%",
          }}
          placeholder="Tell us what you observed"
          onChange={(e) => setDetails(e.target.value)}
          value={longDesc}
          mb={3}
        />
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
