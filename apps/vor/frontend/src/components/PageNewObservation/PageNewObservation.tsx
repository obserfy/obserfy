/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, Image, jsx } from "theme-ui"
import { useImmer } from "use-immer"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Typography from "../Typography/Typography"
import { useGetStudent } from "../../api/useGetStudent"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import usePostNewObservation from "../../api/usePostNewObservation"
import { navigate } from "../Link/Link"
import { STUDENT_OVERVIEW_PAGE_URL, STUDENTS_URL } from "../../routes"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"
import usePostNewStudentImage from "../../api/students/usePostNewStudentImage"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import DateInput from "../DateInput/DateInput"
import dayjs from "../../dayjs"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import Chip from "../Chip/Chip"
import BackButton from "../BackButton/BackButton"
import { borderFull } from "../../border"

interface Props {
  studentId: string
}
export const PageNewObservation: FC<Props> = ({ studentId }) => {
  const [postNewObservation, { isLoading }] = usePostNewObservation(studentId)
  const student = useGetStudent(studentId)
  const areas = useGetCurriculumAreas()

  const [shortDesc, setShortDesc] = useState("")
  const [longDesc, setDetails] = useState("")
  const [images, setImages] = useImmer<Array<{ id: string; file: File }>>([])
  const [eventTime, setEventTime] = useState(dayjs())
  const [areaId, setAreaId] = useState<string>()

  async function submit(): Promise<void> {
    const response = await postNewObservation({
      images: images.map((image) => image.id),
      longDesc,
      shortDesc,
      eventTime,
      areaId,
    })

    if (response?.ok) {
      analytics.track("Observation Created")
      await navigate(STUDENT_OVERVIEW_PAGE_URL(studentId))
    } else {
      analytics.track("Create Observation Failed")
    }
  }

  return (
    <Fragment>
      <TranslucentBar
        boxSx={{
          position: "sticky",
          top: 0,
          borderBottomWidth: 1,
          borderBottomColor: "borderSolid",
          borderBottomStyle: "solid",
        }}
      >
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} m="auto">
          <BackButton to={STUDENT_OVERVIEW_PAGE_URL(studentId)} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>Students</BreadcrumbItem>
            <BreadcrumbItem to={STUDENT_OVERVIEW_PAGE_URL(studentId)}>
              {student.data?.name.split(" ")[0]}
            </BreadcrumbItem>
            <BreadcrumbItem>New Observation</BreadcrumbItem>
          </Breadcrumb>
          <Button
            ml="auto"
            p={isLoading ? 1 : 2}
            my={2}
            mr={3}
            onClick={submit}
            disabled={shortDesc === ""}
          >
            {isLoading ? <LoadingIndicator size={22} /> : "Save"}
          </Button>
        </Flex>
      </TranslucentBar>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4} px={3} mt={3}>
        <Input
          label="Short Description*"
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
        <Typography.Body
          sx={{ fontSize: 1, color: "textMediumEmphasis" }}
          mb={2}
        >
          Related Area
        </Typography.Body>
        <Flex mb={2} sx={{ flexWrap: "wrap" }}>
          {areas.data?.map(({ id, name }) => {
            const isSelected = id === areaId
            return (
              <Chip
                key={id}
                activeBackground="primary"
                text={name}
                mr={2}
                mb={2}
                isActive={isSelected}
                onClick={() => {
                  if (isSelected) {
                    setAreaId(undefined)
                  } else {
                    setAreaId(id)
                  }
                }}
              />
            )
          })}
        </Flex>
        <DateInput
          value={eventTime}
          label="Event Time"
          onChange={(value) => {
            setEventTime(value)
          }}
          mb={3}
        />
        <Typography.Body sx={{ color: "textMediumEmphasis" }} mb={2}>
          Attach Images
        </Typography.Body>
        <Flex sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <UploadImageButton
            studentId={studentId}
            onUploaded={(image) =>
              setImages((draft) => {
                draft.push(image)
              })
            }
          />
          {images.map((image) => {
            return (
              <Image
                key={image.id}
                mr={3}
                mb={3}
                sx={{
                  height: 40,
                  width: 40,
                  objectFit: "cover",
                  borderRadius: "default",
                }}
                src={URL.createObjectURL(image.file)}
              />
            )
          })}
        </Flex>
      </Box>
    </Fragment>
  )
}

const UploadImageButton: FC<{
  studentId: string
  onUploaded: (image: { id: string; file: File }) => void
}> = ({ onUploaded, studentId }) => {
  const [postNewStudentImage, { isLoading }] = usePostNewStudentImage(studentId)

  return (
    <Card
      as="label"
      mr={3}
      mb={3}
      sx={{
        width: 40,
        height: 40,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        "&:hover": {
          borderColor: "primary",
        },
        ...borderFull,
      }}
    >
      {isLoading ? <LoadingIndicator /> : <Icon as={PlusIcon} />}
      <Input
        type="file"
        sx={{ display: "none" }}
        accept="image/*"
        onChange={async (e) => {
          const selectedImage = e.target.files?.[0]
          if (!selectedImage) return

          const result = await postNewStudentImage(selectedImage)
          if (result?.ok) {
            const response = await result.json()
            onUploaded({ id: response.id, file: selectedImage })
          }
        }}
      />
    </Card>
  )
}

export default PageNewObservation
