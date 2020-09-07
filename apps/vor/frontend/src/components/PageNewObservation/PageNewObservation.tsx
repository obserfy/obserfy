/** @jsx jsx */
import { FC, FormEvent, Fragment, useState } from "react"
import { jsx, Box, Button, Flex } from "theme-ui"
import { categories } from "../../categories"
import Select from "../Select/Select"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import usePostNewObservation from "../../api/usePostNewObservation"
import { Link, navigate } from "../Link/Link"
import { STUDENT_OVERVIEW_PAGE_URL } from "../../routes"

interface Props {
  studentId: string
}
export const PageNewObservation: FC<Props> = ({ studentId }) => {
  const [postNewObservation, { isLoading }] = usePostNewObservation(studentId)
  const student = useGetStudent(studentId)

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
      await navigate(STUDENT_OVERVIEW_PAGE_URL(studentId))
    } else {
      analytics.track("Create Observation Failed", {
        responseStatus: response.status,
      })
    }
  }

  return (
    <Fragment>
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "surface",
          borderBottomWidth: 1,
          borderBottomColor: "border",
          borderBottomStyle: "solid",
        }}
        mb={3}
      >
        <Flex
          sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }}
          margin="auto"
        >
          <Link
            to={STUDENT_OVERVIEW_PAGE_URL(studentId)}
            sx={{ fontSize: 1, color: "textMediumEmphasis", ml: 3 }}
          >
            {student.data?.name.split(" ")[0]}
          </Link>
          <span sx={{ mx: 1 }}>/</span>
          <Typography.Body sx={{ fontSize: [1, 1], color: "text" }}>
            New Observation
          </Typography.Body>
          <Button
            ml="auto"
            p={2}
            my={2}
            mr={3}
            onClick={submit}
            disabled={shortDesc === ""}
          >
            {isLoading && <LoadingIndicator />} Save
          </Button>
        </Flex>
      </Box>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4}>
        <Box px={3}>
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
        </Box>
      </Box>
    </Fragment>
  )
}

export default PageNewObservation
