import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Button, Flex, Text } from "theme-ui"
import { borderBottom, borderLeft } from "../../border"
import { Dayjs } from "../../dayjs"
import usePatchReport from "../../hooks/api/reports/usePatchReport"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ReactComponent as CloseIcon } from "../../icons/close.svg"
import { ReactComponent as TrashIcon } from "../../icons/trash.svg"
import DatePickerDialog from "../DatePickerDialog/DatePickerDialog"
import Icon from "../Icon/Icon"
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
        <Button variant="secondary" p={2} onClick={onClose} ml={2}>
          <Icon as={CloseIcon} size={18} />
        </Button>

        <Text sx={{ fontWeight: "bold", color: "textMediumEmphasis" }} ml={2}>
          <Trans>Report Details</Trans>
        </Text>

        <Button variant="secondary" ml="auto" p={2} onClick={onClose} mr={2}>
          <Icon as={TrashIcon} size={18} />
        </Button>
      </Flex>

      <Box py={3}>
        <Row>
          <Title>
            <Trans>Title</Trans>
          </Title>
          <TitleField title={title} />
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

const TitleField: FC<{
  title: string
}> = ({ title }) => {
  const edit = useVisibilityState()

  return (
    <>
      <Value onClick={edit.show}>{title}</Value>
    </>
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
  <Flex px={3} mb={3} sx={{ alignItems: "center" }}>
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
    variant="secondary"
    onClick={onClick}
    sx={{
      color: "text",
      textOverflow: "ellipsis",
      overflow: "hidden",
    }}
  >
    {children}
  </Button>
)

export default EditReportSideBar
