import React, { FC } from "react"
import { Box, Button } from "theme-ui"
import { t, Trans } from "@lingui/macro"
import useGetPlan from "../../api/plans/useGetPlan"
import useDeletePlan from "../../api/plans/useDeletePlan"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import {
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENT_PLANS_URL,
  STUDENTS_URL,
} from "../../routes"
import dayjs from "../../dayjs"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import { useGetStudent } from "../../api/useGetStudent"
import TopBar from "../TopBar/TopBar"
import RelatedStudentsCard from "./RelatedStudentsCard"
import LessonPlanLinksCard from "./LessonPlanLinksCard"
import LessonPlanMetaCard from "./LessonPlanMetaCard"
import LessonPlanDescriptionCard from "./LessonPlanDescriptionCard"
import Icon from "../Icon/Icon"
import AlertDialog from "../AlertDialog/AlertDialog"
import { navigate } from "../Link/Link"
import useVisibilityState from "../../hooks/useVisibilityState"

interface Props {
  studentId: string
  planId: string
}
export const PageStudentPlanDetails: FC<Props> = ({ studentId, planId }) => {
  const { data: plan, isLoading: isLoadingPlan } = useGetPlan(planId)
  const { data: student } = useGetStudent(studentId)

  const navigateBack = () =>
    navigate(STUDENT_PLANS_URL(studentId, dayjs(plan?.date)))

  const breadcrumbs = [
    {
      text: t`Students`,
      to: STUDENTS_URL,
    },
    {
      text: student?.name.split(" ")[0] ?? "",
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
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} pb={3} mx="auto">
        <TopBar breadcrumbs={breadcrumbs} />
        <LessonPlanMetaCard
          planId={planId}
          date={plan?.date}
          areaId={plan?.areaId}
          title={plan?.title}
        />
        <LessonPlanDescriptionCard
          planId={planId}
          description={plan?.description}
        />
        <LessonPlanLinksCard planId={planId} links={plan?.links ?? []} />
        <RelatedStudentsCard
          studentId={studentId}
          planId={planId}
          students={plan?.relatedStudents ?? []}
        />
        <DeleteLessonPlanButton
          planId={planId}
          title={plan?.title}
          onDeleted={navigateBack}
        />
      </Box>
    </>
  )
}

const DeleteLessonPlanButton: FC<{
  planId: string
  title?: string
  onDeleted: () => void
}> = ({ planId, title, onDeleted }) => {
  const [deletePlan] = useDeletePlan(planId)
  const dialog = useVisibilityState()

  const handleDelete = async () => {
    const result = await deletePlan()
    if (result?.ok) onDeleted()
  }

  return (
    <>
      <Button
        variant="outline"
        my={3}
        mr={[3, 0]}
        ml="auto"
        onClick={dialog.show}
        color="danger"
      >
        <Icon as={TrashIcon} mr={2} fill="danger" />
        <Trans>Delete</Trans>
      </Button>
      {dialog.visible && (
        <AlertDialog
          title={t`Delete plan?`}
          positiveText={t`Delete`}
          body={t`Are you sure you want to delete ${title}?`}
          onNegativeClick={dialog.hide}
          onPositiveClick={handleDelete}
        />
      )}
    </>
  )
}

export default PageStudentPlanDetails
