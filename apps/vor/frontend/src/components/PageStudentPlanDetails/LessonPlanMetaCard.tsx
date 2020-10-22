import React, { FC, useState } from "react"
import { Box, Card, Flex } from "theme-ui"
import { useLingui } from "@lingui/react"
import { t } from "@lingui/macro"
import dayjs, { Dayjs } from "../../dayjs"
import usePatchPlan from "../../api/plans/usePatchPlans"
import DataBox from "../DataBox/DataBox"

import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Input from "../Input/Input"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import Chip from "../Chip/Chip"
import useVisibilityState from "../../hooks/useVisibilityState"
import useInputState from "../../hooks/useInputState"

interface Props {
  planId: string
  date?: string
  areaId?: string
  title?: string
}
const LessonPlanMetaCard: FC<Props> = ({ planId, date, areaId, title }) => (
  <Card mb={3} sx={{ borderRadius: [0, "default"] }}>
    <DateDataBox value={date} lessonPlanId={planId} />
    <AreaDataBox value={areaId} lessonPlanId={planId} />
    <TitleDataBox value={title} lessonPlanId={planId} />
  </Card>
)

const DateDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const dialog = useVisibilityState()
  const [patchPlan, { isLoading }] = usePatchPlan(lessonPlanId)

  const updateDate = async (date: Dayjs) => {
    const result = await patchPlan({ date })
    if (result?.ok) dialog.hide()
  }

  return (
    <>
      <DataBox
        label={t`Date`}
        onEditClick={dialog.show}
        value={value ? dayjs(value).format("D MMMM YYYY") : "N/A"}
      />
      {dialog.visible && (
        <DatePickerDialog
          isLoading={isLoading}
          defaultDate={dayjs(value)}
          onConfirm={updateDate}
          onDismiss={dialog.hide}
        />
      )}
    </>
  )
}

const AreaDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const classes = useGetCurriculumAreas()
  const [areaId, setAreaId] = useState(value)
  const [patchPlan, { isLoading }] = usePatchPlan(lessonPlanId)
  const dialog = useVisibilityState()

  const updateArea = async () => {
    const result = await patchPlan({ areaId })
    if (result?.ok) dialog.hide()
  }

  return (
    <>
      <DataBox
        label={t`Related Area`}
        value={classes.data?.find(({ id }) => id === value)?.name || "Other"}
        onEditClick={dialog.show}
      />
      {dialog.visible && (
        <Dialog>
          <DialogHeader
            title={t`Change Area`}
            onAcceptText={t`Save`}
            onCancel={dialog.hide}
            onAccept={updateArea}
            loading={isLoading}
          />
          <Flex
            backgroundColor="background"
            sx={{ flexWrap: "wrap" }}
            p={3}
            pb={2}
          >
            {classes.data?.map(({ id, name }) => (
              <Chip
                mr={2}
                mb={2}
                key={id}
                text={name}
                onClick={() => setAreaId(id)}
                isActive={id === areaId}
              />
            ))}
          </Flex>
        </Dialog>
      )}
    </>
  )
}

const TitleDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  lessonPlanId,
  value,
}) => {
  const dialog = useVisibilityState()
  const [title, setTitle] = useInputState(value)
  const [patchPlan, { isLoading }] = usePatchPlan(lessonPlanId)
  const { i18n } = useLingui()

  const updateTitle = async () => {
    const result = await patchPlan({ title })
    if (result?.ok) dialog.hide()
  }

  return (
    <>
      <DataBox label="Title" value={value} onEditClick={dialog.show} />
      {dialog.visible && (
        <Dialog>
          <DialogHeader
            title={t`Edit Title`}
            onCancel={dialog.hide}
            onAccept={updateTitle}
            loading={isLoading}
          />
          <Box backgroundColor="background" p={3}>
            <Input
              label={i18n._(t`Title`)}
              sx={{ width: "100%" }}
              value={title}
              onChange={setTitle}
            />
          </Box>
        </Dialog>
      )}
    </>
  )
}

export default LessonPlanMetaCard
