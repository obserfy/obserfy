import { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { t, Trans } from "@lingui/macro"
import { getFirstName } from "../../domain/person"
import {
  NEW_STUDENT_PLANS_URL,
  STUDENT_OVERVIEW_URL,
  STUDENT_PLANS_DETAILS_URL,
  STUDENT_PLANS_URL,
  STUDENTS_URL,
} from "../../routes"
import dayjs from "../../dayjs"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { Link } from "../Link/Link"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import useGetStudentPlans from "../../hooks/api/students/useGetStudentPlans"
import TopBar, { breadCrumb } from "../TopBar/TopBar"

interface Props {
  studentId: string
  date?: string
}
export const PageStudentPlans: FC<Props> = ({ studentId, date }) => {
  const [selectedDate, setSelectedDate] = useState(date ? dayjs(date) : dayjs())
  const student = useGetStudent(studentId)
  const { data } = useGetStudentPlans(studentId, selectedDate)

  const handleMoveDate = (range: number) => () => {
    const newDate = selectedDate.add(range, "day")
    setSelectedDate(newDate)
    // Update the url without re-rendering the whole component tree
    window.history.replaceState({}, "", STUDENT_PLANS_URL(studentId, newDate))
  }

  const handleResetDate = () => {
    const newDate = dayjs()
    setSelectedDate(newDate)
    // Update the url without re-rendering the whole component tree
    window.history.replaceState({}, "", STUDENT_PLANS_URL(studentId, newDate))
  }

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Students`, STUDENTS_URL),
          breadCrumb(
            getFirstName(student.data),
            STUDENT_OVERVIEW_URL(studentId)
          ),
          breadCrumb(t`Plans`),
        ]}
      />

      <Flex px={3} pb={3} sx={{ alignItems: "center" }}>
        <Typography.Body color="textMediumEmphasis">
          {selectedDate.format("dddd, DD MMM YYYY")}
        </Typography.Body>
        <Button
          variant="outline"
          p={1}
          mr={1}
          ml="auto"
          aria-label="previous-date"
          onClick={handleMoveDate(-1)}
        >
          <Icon as={PrevIcon} />
        </Button>
        <Button
          variant="outline"
          mr={2}
          py={1}
          px={1}
          aria-label="next-date"
          onClick={handleMoveDate(1)}
        >
          <Icon as={NextIcon} />
        </Button>
        <Button
          variant="outline"
          py={2}
          px={3}
          onClick={handleResetDate}
          disabled={selectedDate.isSame(dayjs(), "day")}
        >
          <Trans>Today</Trans>
        </Button>
      </Flex>

      {data?.map((plan) => (
        <Link
          key={plan.id}
          to={STUDENT_PLANS_DETAILS_URL(studentId, plan.id)}
          sx={{ display: "block", mb: [0, 2], mx: 3 }}
        >
          <Card p={3}>
            <Typography.Body>{plan.title}</Typography.Body>
            <Typography.Body sx={{ color: "textMediumEmphasis" }}>
              {plan.area ? plan.area.name : "Other"}
            </Typography.Body>
            {plan.user?.name && (
              <Typography.Body
                sx={{ fontSize: 0, color: "textMediumEmphasis" }}
                mt={2}
              >
                <Trans>Created by</Trans> {plan.user.name}
              </Typography.Body>
            )}
          </Card>
        </Link>
      ))}

      <Link
        to={NEW_STUDENT_PLANS_URL(studentId, selectedDate)}
        sx={{ display: "block", m: 3 }}
      >
        <Button variant="outline" sx={{ ml: "auto" }}>
          <Icon as={PlusIcon} mr={2} fill="onBackground" />
          <Trans>Add new plan</Trans>
        </Button>
      </Link>
    </Box>
  )
}

export default PageStudentPlans
