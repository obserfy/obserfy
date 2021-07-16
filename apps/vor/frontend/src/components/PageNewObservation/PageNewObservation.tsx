import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC, useState } from "react"
import { Box, Button, Card, Flex, Image } from "theme-ui"
import { useImmer } from "use-immer"
import { track } from "../../analytics"
import { borderBottom, borderFull } from "../../border"
import dayjs from "../../dayjs"
import { getFirstName } from "../../domain/person"
import usePostNewStudentImage from "../../hooks/api/students/usePostNewStudentImage"
import { useGetCurriculumAreas } from "../../hooks/api/useGetCurriculumAreas"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import usePostNewObservation from "../../hooks/api/usePostNewObservation"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { STUDENT_OVERVIEW_URL, STUDENTS_URL } from "../../routes"
import BackButton from "../BackButton/BackButton"
import Breadcrumb from "../Breadcrumb/Breadcrumb"
import BreadcrumbItem from "../Breadcrumb/BreadcrumbItem"
import Checkbox from "../Checkbox/Checkbox"
import Chip from "../Chip/Chip"
import DateInput from "../DateInput/DateInput"
import Icon from "../Icon/Icon"
import ImagePreviewOverlay from "../ImagePreviewOverlay/ImagePreviewOverlay"
import Input from "../Input/Input"
import { navigate } from "../Link/Link"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import Typography from "../Typography/Typography"

interface Props {
  studentId: string
}
export const PageNewObservation: FC<Props> = ({ studentId }) => {
  const postNewObservation = usePostNewObservation(studentId)
  const { data: student } = useGetStudent(studentId)
  const { data: areas } = useGetCurriculumAreas()

  const [shortDesc, setShortDesc] = useState("")
  const [longDesc, setLongDesc] = useState("")
  const [images, setImages] = useImmer<Array<{ id: string; file: File }>>([])
  const [eventTime, setEventTime] = useState(dayjs())
  const [areaId, setAreaId] = useState<string>()
  const [visibleToGuardians, setVisibleToGuardians] = useState(false)

  async function submit(): Promise<void> {
    try {
      await postNewObservation.mutateAsync({
        images: images.map((image) => image.id),
        longDesc,
        shortDesc,
        eventTime,
        areaId,
        visibleToGuardians,
      })
      await navigate(STUDENT_OVERVIEW_URL(studentId))
      track("Observation Created")
    } catch (e) {
      track("Create Observation Failed")
      Sentry.captureException(e)
    }
  }

  const { i18n } = useLingui()

  return (
    <>
      <TranslucentBar boxSx={{ position: "sticky", top: 0, ...borderBottom }}>
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} m="auto">
          <BackButton to={STUDENT_OVERVIEW_URL(studentId)} />
          <Breadcrumb>
            <BreadcrumbItem to={STUDENTS_URL}>
              <Trans>Students</Trans>
            </BreadcrumbItem>
            <BreadcrumbItem to={STUDENT_OVERVIEW_URL(studentId)}>
              {getFirstName(student)}
            </BreadcrumbItem>
            <BreadcrumbItem>
              <Trans>New Observation</Trans>
            </BreadcrumbItem>
          </Breadcrumb>
          <Button
            ml="auto"
            p={postNewObservation.isLoading ? 1 : 2}
            my={2}
            mr={3}
            onClick={submit}
            disabled={shortDesc === ""}
          >
            {postNewObservation.isLoading ? (
              <LoadingIndicator size={22} />
            ) : (
              <Trans>Save</Trans>
            )}
          </Button>
        </Flex>
      </TranslucentBar>

      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto" pb={4} px={3} mt={3}>
        <Input
          label={t`Short Description*`}
          sx={{ width: "100%" }}
          placeholder={i18n._(t`What have you found?`)}
          onChange={(e) => setShortDesc(e.target.value)}
          value={shortDesc}
          mb={2}
        />

        <Checkbox
          containerSx={{ mb: 3 }}
          label={t` Visible to guardians `}
          checked={visibleToGuardians}
          onChange={setVisibleToGuardians}
        />

        <Card sx={{ ...borderFull, overflow: "hidden" }} mb={3}>
          <Typography.Body p={3} sx={{ fontWeight: "bold", ...borderBottom }}>
            <Trans>Observation Details</Trans>
          </Typography.Body>
          <MarkdownEditor onChange={setLongDesc} value={longDesc} />
        </Card>

        <Typography.Body sx={{ color: "textMediumEmphasis" }} mb={2}>
          <Trans>Related Area</Trans>
        </Typography.Body>
        <Flex mb={2} sx={{ flexWrap: "wrap" }}>
          {areas?.map(({ id, name }) => {
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
          label={t`Event Time`}
          onChange={(value) => setEventTime(value)}
          mb={3}
        />
        <Typography.Body sx={{ color: "textMediumEmphasis" }} mb={2}>
          <Trans>Attach Images</Trans>
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
          {images.map((image) => (
            <ImagePreview
              studentId={studentId}
              key={image.id}
              src={URL.createObjectURL(image.file)}
              imageId={image.id}
              onDeleted={() =>
                setImages((draft) => draft.filter(({ id }) => id !== image.id))
              }
            />
          ))}
        </Flex>
      </Box>
    </>
  )
}

const ImagePreview: FC<{
  imageId: string
  studentId: string
  src: string
  onDeleted: () => void
}> = ({ studentId, src, imageId, onDeleted }) => {
  const dialog = useVisibilityState()

  return (
    <>
      <Image
        data-cy="image"
        onClick={dialog.show}
        src={src}
        mr={2}
        mb={3}
        sx={{
          height: 40,
          width: 40,
          objectFit: "cover",
          borderRadius: "default",
        }}
      />
      {dialog.visible && (
        <ImagePreviewOverlay
          onDeleted={onDeleted}
          imageId={imageId}
          onDismiss={dialog.hide}
          studentId={studentId}
          src={src}
        />
      )}
    </>
  )
}

const UploadImageButton: FC<{
  studentId: string
  onUploaded: (image: { id: string; file: File }) => void
}> = ({ onUploaded, studentId }) => {
  const postNewStudentImage = usePostNewStudentImage(studentId)

  return (
    <Card
      as="label"
      mr={2}
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
      {postNewStudentImage.isLoading ? (
        <LoadingIndicator />
      ) : (
        <Icon as={PlusIcon} />
      )}
      <Input
        data-cy="upload-image"
        type="file"
        sx={{ display: "none" }}
        accept="image/*"
        onChange={async (event) => {
          const selectedImage = event.target.files?.[0]
          if (!selectedImage) return

          try {
            const response = await postNewStudentImage.mutateAsync(
              selectedImage
            )
            onUploaded({ id: response.id, file: selectedImage })
          } catch (e) {
            Sentry.captureException(e)
          }
        }}
      />
    </Card>
  )
}

export default PageNewObservation
