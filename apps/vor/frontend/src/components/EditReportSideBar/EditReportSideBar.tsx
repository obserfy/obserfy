import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC, useState } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { borderBottom, borderLeft } from "../../border"
import { Dayjs } from "../../dayjs"
import useDeleteReport from "../../hooks/api/reports/useDeleteReport"
import usePatchReport from "../../hooks/api/reports/usePatchReport"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import { ALL_REPORT_URL } from "../../routes"
import AlertDialog from "../AlertDialog/AlertDialog"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import Dialog from "../Dialog/Dialog"
import DialogHeader from "../DialogHeader/DialogHeader"
import Icon from "../Icon/Icon"
import Input from "../Input/Input"
import { navigate } from "../Link/Link"
import Portal from "../Portal/Portal"

export interface EditReportSideBarProps {
  title: string
  periodStart: Dayjs
  periodEnd: Dayjs
  open: boolean
  onClose: () => void
  reportId: string
}

const EditReportSideBar: FC<EditReportSideBarProps> = ({
  open,
  onClose,
  title,
  periodEnd,
  periodStart,
  reportId,
}) => (
  <Portal>
    <Box
      onClick={onClose}
      sx={{
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: "fixed",
        backgroundColor: "black",
        opacity: open ? 0.4 : 0,
        zIndex: 900,
        display: ["none", "block"],
        pointerEvents: open ? undefined : "none",
        transition: "ease-in-out 200ms opacity",
      }}
    />

    <Box
      sx={{
        ...borderLeft,
        backgroundColor: "surface",
        position: "fixed",
        top: 0,
        right: open ? 0 : ["-100%", -400],
        bottom: 0,
        width: ["100%", 400],
        zIndex: 1000,
        transition: "ease-in-out 120ms right",
      }}
    >
      <Flex
        sx={{
          ...borderBottom,
          height: 48,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button variant="text" p={2} onClick={onClose} ml={2}>
          <Icon as={CloseIcon} size={18} />
        </Button>

        <Text sx={{ fontWeight: "bold", color: "textMediumEmphasis" }} ml={2}>
          <Trans>Report Details</Trans>
        </Text>

        <DeleteReportButton reportId={reportId} />
      </Flex>

      <Box py={3}>
        <Row>
          <Title>
            <Trans>Title</Trans>
          </Title>
          <TitleField reportId={reportId} value={title} />
        </Row>

        <Row>
          <Title>
            <Trans>Period Start</Trans>
          </Title>
          <PeriodStartField reportId={reportId} currentValue={periodStart} />
        </Row>

        <Row>
          <Title>
            <Trans>Period End</Trans>
          </Title>
          <PeriodEndField reportId={reportId} currentValue={periodEnd} />
        </Row>
      </Box>
    </Box>
  </Portal>
)

const DeleteReportButton: FC<{
  reportId: string
}> = ({ reportId }) => {
  const deleteDialog = useVisibilityState()
  const deleteReport = useDeleteReport(reportId)

  return (
    <>
      <Button variant="text" ml="auto" p={2} mr={2} onClick={deleteDialog.show}>
        <Icon as={TrashIcon} size={18} />
      </Button>

      {deleteDialog.visible && (
        <AlertDialog
          title="Delete Report?"
          body="This will permanently delete this report."
          positiveText="Delete"
          onNegativeClick={deleteDialog.hide}
          onPositiveClick={async () => {
            const result = await deleteReport.mutateAsync()
            if (result?.ok) {
              navigate(ALL_REPORT_URL)
            }
          }}
        />
      )}
    </>
  )
}

const TitleField: FC<{
  reportId: string
  value: string
}> = ({ reportId, value }) => {
  const edit = useVisibilityState()
  const patchReport = usePatchReport(reportId)

  return (
    <>
      <Value onClick={edit.show}>{value}</Value>
      {edit.visible && (
        <EditTitleDialog
          defaultValue={value}
          isLoading={patchReport.isLoading}
          onClose={edit.hide}
          onSubmit={async (title) => {
            const result = await patchReport.mutateAsync({ title })
            if (result?.ok) {
              edit.hide()
            }
          }}
        />
      )}
    </>
  )
}

const EditTitleDialog: FC<{
  defaultValue: string
  onSubmit: (value: string) => void
  onClose: () => void
  isLoading: boolean
}> = ({ defaultValue, isLoading, onSubmit, onClose }) => {
  const [value, setValue] = useState(defaultValue)
  const { i18n } = useLingui()

  return (
    <Dialog>
      <DialogHeader
        title={i18n._(t`Report Title`)}
        loading={isLoading}
        onCancel={onClose}
        onAccept={() => {
          onSubmit(value)
        }}
      />
      <Box p={3} sx={{ backgroundColor: "background" }}>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </Box>
    </Dialog>
  )
}

const PeriodStartField: FC<{
  reportId: string
  currentValue: Dayjs
}> = ({ reportId, currentValue }) => {
  const edit = useVisibilityState()
  const patchReport = usePatchReport(reportId)

  return (
    <>
      <Value onClick={edit.show}>{currentValue.format("DD MMM YYYY")}</Value>
      {edit.visible && (
        <DatePickerDialog
          title="Period Start"
          onDismiss={edit.hide}
          isLoading={patchReport.isLoading}
          defaultDate={currentValue}
          onConfirm={async (periodStart) => {
            const result = await patchReport.mutateAsync({ periodStart })
            if (result?.ok) {
              edit.hide()
            }
          }}
        />
      )}
    </>
  )
}

const PeriodEndField: FC<{
  reportId: string
  currentValue: Dayjs
}> = ({ currentValue, reportId }) => {
  const edit = useVisibilityState()
  const patchReport = usePatchReport(reportId)

  return (
    <>
      <Value onClick={edit.show}>{currentValue.format("DD MMM YYYY")}</Value>
      {edit.visible && (
        <DatePickerDialog
          title="Period End"
          onDismiss={edit.hide}
          isLoading={patchReport.isLoading}
          defaultDate={currentValue}
          onConfirm={async (periodEnd) => {
            const result = await patchReport.mutateAsync({ periodEnd })
            if (result?.ok) {
              edit.hide()
            }
          }}
        />
      )}
    </>
  )
}

const Row: FC = ({ children }) => (
  <Flex px={3} mb={3} sx={{ alignItems: "center", overflow: "hidden" }}>
    {children}
  </Flex>
)

const Title: FC = ({ children }) => (
  <Text
    sx={{
      width: "100px",
      flexShrink: 0,
      fontWeight: "bold",
      color: "textMediumEmphasis",
      opacity: 70,
    }}
  >
    {children}
  </Text>
)

const Value: FC<{
  onClick: () => void
}> = ({ children, onClick }) => (
  <Button
    p={2}
    variant="text"
    onClick={onClick}
    sx={{
      color: "text",
      textOverflow: "ellipsis",
    }}
  >
    {children}
  </Button>
)

export default EditReportSideBar
