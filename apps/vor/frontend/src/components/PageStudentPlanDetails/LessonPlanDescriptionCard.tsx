import React, { FC, useState } from "react"
import { Box, Card } from "theme-ui"
import { useLingui } from "@lingui/react"
import { t } from "@lingui/macro"
import usePatchPlan from "../../api/plans/usePatchPlans"
import MultilineDataBox from "../MultilineDataBox/MultilineDataBox"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import TextArea from "../TextArea/TextArea"

const LessonPlanDescriptionCard: FC<{
  planId: string
  description?: string
}> = ({ planId, description }) => (
  <Card mb={3} sx={{ borderRadius: [0, "default"] }}>
    <DescriptionDataBox value={description} lessonPlanId={planId} />
  </Card>
)

const DescriptionDataBox: FC<{ value?: string; lessonPlanId: string }> = ({
  value,
  lessonPlanId,
}) => {
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [description, setDescription] = useState(value)
  const [mutate] = usePatchPlan(lessonPlanId)
  const { i18n } = useLingui()

  return (
    <>
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
    </>
  )
}

export default LessonPlanDescriptionCard
