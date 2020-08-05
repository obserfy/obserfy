/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Button, Card, Flex, jsx } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import {
  NEW_STUDENT_PLANS_URL,
  STUDENT_OVERVIEW_PAGE_URL,
  STUDENT_PLANS_DETAILS_URL,
  STUDENT_PLANS_URL,
} from "../../routes"
import dayjs from "../../dayjs"
import Typography from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as PrevIcon } from "../../icons/arrow-back.svg"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { Link } from "../Link/Link"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { useGetStudent } from "../../api/useGetStudent"
import useGetStudentPlans from "../../api/students/useGetStudentPlans"

interface Props {
  studentId: string
  date?: string
}
export const PageStudentPlans: FC<Props> = ({ studentId, date }) => {
  const [selectedDate, setSelectedDate] = useState(date ? dayjs(date) : dayjs())
  const student = useGetStudent(studentId)
  const { data } = useGetStudentPlans(studentId, selectedDate)

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.sm" }}>
      <BackNavigation
        to={STUDENT_OVERVIEW_PAGE_URL(studentId)}
        text="Student Overview"
      />
      <Typography.H5 mx={3} mt={3} color="textDisabled">
        {student.data?.name}
      </Typography.H5>
      <Typography.H5 mx={3} mb={4}>
        Plans
      </Typography.H5>
      <Flex sx={{ alignItems: "center" }} px={3} pb={2}>
        <Typography.Body color="textMediumEmphasis">
          {selectedDate.format("ddd, DD MMM 'YY")}
        </Typography.Body>
        <Button
          variant="outline"
          py={1}
          px={1}
          mr={1}
          ml="auto"
          aria-label="previous-date"
          onClick={() => {
            const newDate = selectedDate.add(-1, "day")
            setSelectedDate(newDate)
            // Update the url without re-rendering the whole component tree
            window.history.replaceState(
              {},
              "",
              STUDENT_PLANS_URL(studentId, newDate)
            )
          }}
        >
          <Icon as={PrevIcon} />
        </Button>
        <Button
          variant="outline"
          mr={2}
          py={1}
          px={1}
          aria-label="next-date"
          onClick={() => {
            const newDate = selectedDate.add(1, "day")
            setSelectedDate(newDate)
            // Update the url without re-rendering the whole component tree
            window.history.replaceState(
              {},
              "",
              STUDENT_PLANS_URL(studentId, newDate)
            )
          }}
        >
          <Icon as={NextIcon} />
        </Button>
        <Button
          variant="outline"
          py={1}
          px={3}
          onClick={() => {
            const newDate = dayjs()
            setSelectedDate(newDate)
            // Update the url without re-rendering the whole component tree
            window.history.replaceState(
              {},
              "",
              STUDENT_PLANS_URL(studentId, newDate)
            )
          }}
          disabled={selectedDate.isSame(dayjs(), "day")}
        >
          Today
        </Button>
      </Flex>
      {data?.map((plan) => {
        return (
          <Link
            to={STUDENT_PLANS_DETAILS_URL(studentId, plan.id)}
            sx={{ display: "block", mx: [0, 3], mb: [0, 2] }}
          >
            <Card px={3} py={2} sx={{ borderRadius: [0, "default"] }}>
              <Typography.Body>{plan.title}</Typography.Body>
              <Typography.Body
                sx={{ fontSize: 1, color: "textMediumEmphasis" }}
              >
                {plan.area ? plan.area.name : "Other"}
              </Typography.Body>
              {plan.user?.name && (
                <Typography.Body
                  sx={{ fontSize: 0, color: "textMediumEmphasis" }}
                  mt={2}
                >
                  Created by {plan.user.name.split(" ")[0]}
                </Typography.Body>
              )}
            </Card>
          </Link>
        )
      })}
      <Link
        to={NEW_STUDENT_PLANS_URL(studentId, selectedDate)}
        sx={{ display: "block", m: 3 }}
      >
        <Button variant="outline" sx={{ ml: "auto" }}>
          <Icon as={PlusIcon} mr={2} fill="onBackground" />
          Add new plan
        </Button>
      </Link>
    </Box>
  )
}

export default PageStudentPlans
