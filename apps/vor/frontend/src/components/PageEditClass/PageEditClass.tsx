import { FC, useEffect, useRef, useState } from "react"
import { useImmer } from "use-immer"
import { Flex, Button, Box } from "theme-ui"
import { Trans } from "@lingui/macro"
import { navigate } from "../Link/Link"
import { CLASS_SETTINGS_URL } from "../../routes"
import BackNavigation from "../BackNavigation/BackNavigation"
import { Typography } from "../Typography/Typography"
import Input from "../Input/Input"
import Chip from "../Chip/Chip"
import { WEEKDAYS } from "../PageNewClass/PageNewClass"
import useGetClass from "../../hooks/api/classes/useGetClass"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import usePatchClass from "../../hooks/api/classes/usePatchClass"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"
import DeleteClassDialog from "../DeleteClassDialog/DeleteClassDialog"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import dayjs from "../../dayjs"

interface Props {
  classId: string
}
export const PageEditClass: FC<Props> = ({ classId }) => {
  const [name, setName] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [weekdays, setWeekdays] = useImmer<number[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { mutateAsync, status, error } = usePatchClass(classId)
  const classes = useGetClass(classId)
  const isLoaded = useRef(false)
  const valid = name !== ""

  useEffect(() => {
    const target = classes.data
    if (!target || isLoaded.current) return
    const start = Date.parse(target.startTime)
    const end = Date.parse(target.endTime)
    setName(target.name)
    setStartTime(dayjs(start).format("HH:mm"))
    setEndTime(dayjs(end).format("HH:mm"))
    setWeekdays(() => target.weekdays)
    isLoaded.current = true
  }, [classes.data, setWeekdays])

  const patchClass = async (): Promise<void> => {
    try {
      await mutateAsync({
        name,
        weekdays,
        endTime: dayjs(endTime, "HH:mm").toDate(),
        startTime: dayjs(startTime, "HH:mm").toDate(),
      })
      await navigate(CLASS_SETTINGS_URL)
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <BackNavigation to={CLASS_SETTINGS_URL} text="Class" />
        <Typography.H5 m={3}>
          <Trans>Edit Class</Trans>
        </Typography.H5>
        {classes.status === "loading" && <LoadingState />}
        {classes.status === "success" && (
          <Box p={3}>
            <Input
              label="Name"
              sx={{ width: "100%" }}
              mb={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Flex>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                label="Start Time"
                sx={{ width: "100%" }}
                mb={3}
                mr={3}
              />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                label="End Time"
                sx={{ width: "100%" }}
                mb={3}
              />
            </Flex>
            <Typography.Body mb={2} color="textMediumEmphasis">
              <Trans>Available every</Trans>
            </Typography.Body>
            <Flex
              mb={3}
              sx={{
                flexWrap: "wrap",
              }}
            >
              {WEEKDAYS.map((weekday, i) => (
                <Chip
                  mb={2}
                  mr={2}
                  key={weekday}
                  text={weekday}
                  activeBackground="primary"
                  isActive={weekdays.includes(i)}
                  onClick={() =>
                    setWeekdays((draft) => {
                      if (draft.includes(i)) {
                        return draft.filter((item) => item !== i)
                      }
                      return [...draft, i]
                    })
                  }
                />
              ))}
            </Flex>
            <Flex>
              <Button
                variant="outline"
                mr={3}
                color="danger"
                sx={{ flexShrink: 0 }}
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trans>Delete</Trans>
              </Button>
              <Button
                sx={{ flexGrow: 1 }}
                disabled={!valid || status === "loading"}
                onClick={patchClass}
              >
                {status === "loading" && (
                  <LoadingIndicator mr={2} color="onPrimary" />
                )}
                <Trans>Save</Trans>
              </Button>
            </Flex>
            <ErrorMessage error={error} />
          </Box>
        )}
      </Box>
      {showDeleteDialog && (
        <DeleteClassDialog
          onDismiss={() => setShowDeleteDialog(false)}
          classId={classId}
          name={classes.data?.name ?? ""}
        />
      )}
    </>
  )
}

const LoadingState: FC = () => {
  return (
    <Box m={3} mt={4}>
      <LoadingPlaceholder sx={{ width: "12rem", height: 48 }} mb={3} />
      <LoadingPlaceholder sx={{ width: "100%", height: 48 }} mb={3} />
      <Flex mb={3}>
        <LoadingPlaceholder sx={{ width: "100%", height: 48 }} mb={3} />
        <LoadingPlaceholder sx={{ width: "100%", height: 48 }} />
      </Flex>
      <LoadingPlaceholder sx={{ width: "100%", height: 48 }} mb={3} />
      <LoadingPlaceholder sx={{ width: "100%", height: 48 }} mb={3} />
    </Box>
  )
}

export default PageEditClass
