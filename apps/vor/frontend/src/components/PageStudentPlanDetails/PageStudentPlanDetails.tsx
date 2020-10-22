/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Image, Box, Button, Card, Flex, jsx } from "theme-ui"
import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import useGetPlan, { GetPlanResponseBody } from "../../api/plans/useGetPlan"
import useDeletePlan from "../../api/plans/useDeletePlan"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import {
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENT_PLANS_URL,
  STUDENTS_URL,
} from "../../routes"
import dayjs from "../../dayjs"
import Icon from "../Icon/Icon"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import AlertDialog from "../AlertDialog/AlertDialog"
import { navigate } from "../Link/Link"
import usePatchPlan from "../../api/plans/usePatchPlans"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import TextArea from "../TextArea/TextArea"
import Chip from "../Chip/Chip"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import { Typography } from "../Typography/Typography"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import { ReactComponent as LinkIcon } from "../../icons/link.svg"
import useDeleteLessonPlanLink from "../../api/plans/useDeleteLessonPlanLink"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import LinkInput from "../LinkInput/LinkInput"
import usePostNewLessonPlanLink from "../../api/plans/usePostNewLessonPlanLink"
import { useGetStudent } from "../../api/useGetStudent"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import DataBox from "../DataBox/DataBox"
import TopBar from "../TopBar/TopBar"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"

interface Props {
  studentId: string
  planId: string
}
export const PageStudentPlanDetails: FC<Props> = ({ studentId, planId }) => {
  const { data: plan, isLoading: isLoadingPlan } = useGetPlan(planId)
  const student = useGetStudent(studentId)
  const [deletePlan] = useDeletePlan(planId)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const breadcrumbs = [
    {
      text: t`Students`,
      to: STUDENTS_URL,
    },
    {
      text: student.data?.name.split(" ")[0] ?? "",
      to: STUDENT_OVERVIEW_PAGE_URL(studentId),
    },
    {
      text: t`Plans`,
      to: STUDENT_PLANS_URL(studentId, dayjs(plan?.date)),
    },
    { text: t`Details` },
  ]

  if (isLoadingPlan) {
    return (
      <Box sx={{ maxWidth: "maxWidth.sm" }} pb={3} mx="auto">
        <TopBar breadcrumbs={breadcrumbs} />
        <LoadingPlaceholder sx={{ width: "100%", height: 213 }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: 129 }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: 140 }} mb={3} />
      </Box>
    )
  }

  return (
    <Fragment>
      <Box sx={{ maxWidth: "maxWidth.sm" }} pb={3} mx="auto">
        <TopBar breadcrumbs={breadcrumbs} />
        <Card mb={3} sx={{ borderRadius: [0, "default"] }}>
          <DateDataBox value={plan?.date} lessonPlanId={planId} />
          <AreaDataBox value={plan?.areaId} lessonPlanId={planId} />
          <TitleDataBox value={plan?.title} lessonPlanId={planId} />
        </Card>

        <Card mb={3} sx={{ borderRadius: [0, "default"] }}>
          <DescriptionDataBox value={plan?.description} lessonPlanId={planId} />
        </Card>

        <Card sx={{ borderRadius: [0, "default"] }} mb={3}>
          <Typography.Body
            mt={3}
            mx={3}
            mb={1}
            color="textMediumEmphasis"
            sx={{ lineHeight: 1, fontSize: 1 }}
          >
            <Trans>Links</Trans>
          </Typography.Body>
          {plan?.links && plan.links.length === 0 && (
            <Typography.Body m={3}>
              <Trans>No links attached yet</Trans>
            </Typography.Body>
          )}
          {plan?.links?.map((link) => (
            <LessonPlanLink key={link.id} link={link} lessonPlanId={planId} />
          ))}
          <UrlField lessonPlanId={planId} />
        </Card>

        <Card p={3} sx={{ borderRadius: [0, "default"] }}>
          <Typography.Body color="textMediumEmphasis">
            <Trans>Related Students</Trans>
          </Typography.Body>
          {plan?.relatedStudents.map(({ name, profilePictureUrl, id }) => (
            <Flex key={id} sx={{ alignItems: "center" }} mt={3}>
              {profilePictureUrl ? (
                <Image
                  src={profilePictureUrl}
                  sx={{ borderRadius: "circle" }}
                />
              ) : (
                <StudentPicturePlaceholder />
              )}
              <Box ml={3}>{name}</Box>
            </Flex>
          ))}
        </Card>

        <Button
          variant="outline"
          my={3}
          mr={[3, 0]}
          ml="auto"
          onClick={() => setShowDeleteDialog(true)}
          color="danger"
        >
          <Icon as={TrashIcon} mr={2} fill="danger" />
          <Trans>Delete</Trans>
        </Button>
      </Box>
      {showDeleteDialog && (
        <AlertDialog
          title={t`Delete plan?`}
          positiveText={t`Delete`}
          body={t`Are you sure you want to delete ${plan?.title}?`}
          onNegativeClick={() => setShowDeleteDialog(false)}
          onPositiveClick={async () => {
            const result = await deletePlan()
            if (result?.ok) {
              await navigate(STUDENT_PLANS_URL(studentId, dayjs(plan?.date)))
            }
          }}
        />
      )}
    </Fragment>
  )
}

const DateDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [mutate] = usePatchPlan(lessonPlanId)

  return (
    <Fragment>
      <DataBox
        label={t`Date`}
        onEditClick={() => setShowEditDialog(true)}
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
      />
      {showEditDialog && (
        <DatePickerDialog
          defaultDate={dayjs(value)}
          onConfirm={async (date) => {
            await mutate({ date })
            setShowEditDialog(false)
          }}
          onDismiss={() => setShowEditDialog(false)}
        />
      )}
    </Fragment>
  )
}

const TitleDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  lessonPlanId,
  value,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [title, setTitle] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)
  const { i18n } = useLingui()

  return (
    <Fragment>
      <DataBox
        label="Title"
        value={value ?? ""}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Title`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ title })
              setShowEditDialog(false)
            }}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <Input
              label={i18n._(t`Title`)}
              sx={{ width: "100%" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const DescriptionDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [description, setDescription] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)
  const { i18n } = useLingui()

  return (
    <Fragment>
      <MultilineDataBox
        label={t`Description`}
        value={value || ""}
        onEditClick={() => setShowEditDialog(true)}
        placeholder="-"
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Edit Description`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ description })
              setShowEditDialog(false)
            }}
          />
          <Box sx={{ backgroundColor: "background" }} p={3}>
            <TextArea
              label={i18n._(t`Description`)}
              sx={{ width: "100%", lineHeight: 1.8, minHeight: 400 }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={i18n._(t`Add some description here`)}
            />
          </Box>
        </Dialog>
      )}
    </Fragment>
  )
}

const AreaDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const classes = useGetCurriculumAreas()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedArea, setSelectedArea] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)

  return (
    <Fragment>
      <DataBox
        label={t`Related Area`}
        value={classes.data?.find(({ id }) => id === value)?.name || "Other"}
        onEditClick={() => setShowEditDialog(true)}
      />
      {showEditDialog && (
        <Dialog>
          <DialogHeader
            title={t`Change Area`}
            onAcceptText={t`Save`}
            onCancel={() => setShowEditDialog(false)}
            onAccept={async () => {
              await mutate({ areaId: selectedArea })
              setShowEditDialog(false)
            }}
          />
          <Flex
            sx={{ backgroundColor: "background", flexWrap: "wrap" }}
            p={3}
            pb={2}
          >
            {classes.data?.map(({ id, name }) => (
              <Chip
                mr={2}
                mb={2}
                key={id}
                text={name}
                activeBackground="primary"
                onClick={() => setSelectedArea(id)}
                isActive={id === selectedArea}
              />
            ))}
          </Flex>
        </Dialog>
      )}
    </Fragment>
  )
}

const LessonPlanLink: FC<{
  link: GetPlanResponseBody["links"][0]
  lessonPlanId: string
}> = ({ link, lessonPlanId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [deleteLink] = useDeleteLessonPlanLink(link.id, lessonPlanId)

  return (
    <Flex my={3} mr={3} sx={{ alignItems: "center", maxHeight: "100%" }}>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          overflowX: ["auto", "hidden"],
        }}
      >
        <Icon as={LinkIcon} ml={3} />
        <Typography.Body
          mx={2}
          sx={{
            whiteSpace: "nowrap",
            display: "inline-block",
            textDecoration: "underline",
          }}
        >
          {link.url}
        </Typography.Body>
      </a>
      <Button
        variant="outline"
        ml="auto"
        color="danger"
        px={2}
        backgroundColor="surface"
        sx={{ zIndex: 2, flexShrink: 0 }}
        onClick={async () => {
          setIsLoading(true)
          const result = await deleteLink()
          if (!result?.ok) {
            setIsLoading(false)
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <LoadingIndicator ml={1} />
        ) : (
          <Icon as={TrashIcon} fill="danger" />
        )}
      </Button>
    </Flex>
  )
}

const UrlField: FC<{ lessonPlanId: string }> = ({ lessonPlanId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [postNewLink] = usePostNewLessonPlanLink(lessonPlanId)
  const [url, setUrl] = useState("")

  async function sendPostNewLinkRequest() {
    setIsLoading(true)
    const result = await postNewLink({ url })
    if (result?.ok) {
      setUrl("")
    }
    setIsLoading(false)
  }

  return (
    <LinkInput
      value={url}
      onChange={setUrl}
      isLoading={isLoading}
      onSave={sendPostNewLinkRequest}
      containerSx={{ mx: 3, mb: 3, mt: 2 }}
      inputSx={{ backgroundColor: "background" }}
    />
  )
}

export default PageStudentPlanDetails
