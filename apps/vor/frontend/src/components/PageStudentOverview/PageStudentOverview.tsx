/** @jsx jsx */
import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Button, Flex, Image, jsx } from "theme-ui"
import { getFirstName } from "../../domain/person"
import { useGetStudent } from "../../hooks/api/useGetStudent"
import { ReactComponent as CalendarIcon } from "../../icons/calendar.svg"
import { ReactComponent as ImageIcon } from "../../icons/image.svg"
import { ReactComponent as PersonIcon } from "../../icons/person.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import {
  NEW_OBSERVATION_URL,
  STUDENT_IMAGES_URL,
  STUDENT_PLANS_URL,
  STUDENT_PROFILE_URL,
  STUDENTS_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import StudentProgressSummaryCard from "../StudentProgressSummaryCard/StudentProgressSummaryCard"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"
import DailyObservationCard from "./DailyObservationCard"

interface Props {
  id: string
}
export const PageStudentOverview: FC<Props> = ({ id }) => {
  const student = useGetStudent(id)

  return (
    <Box sx={{ maxWidth: "maxWidth.md" }} margin="auto" pb={5}>
      <TopBar
        breadcrumbs={[
          breadCrumb("Students", STUDENTS_URL),
          breadCrumb(getFirstName(student.data)),
        ]}
      />

      <Flex sx={{ alignItems: "center" }} mx={3}>
        <Box sx={{ flexShrink: 0 }}>
          {student.data?.profilePic ? (
            <Image
              src={student.data?.profilePic}
              sx={{ width: 32, height: 32, borderRadius: "circle" }}
            />
          ) : (
            <StudentPicturePlaceholder />
          )}
        </Box>
        <Typography.H6
          ml={3}
          mb={2}
          sx={{ wordWrap: "break-word", fontWeight: "bold", lineHeight: 1.4 }}
        >
          {student.data?.name || (
            <LoadingPlaceholder sx={{ width: "12rem", height: 28 }} />
          )}
        </Typography.H6>
      </Flex>

      <Flex mx={3} my={2}>
        <Link sx={{ mr: 2, flexGrow: 1 }} to={STUDENT_PROFILE_URL(id)}>
          <Button data-cy="edit" variant="outline" sx={{ width: "100%" }}>
            <Icon as={PersonIcon} fill="textPrimary" mr={2} />
            <Trans>Profile</Trans>
          </Button>
        </Link>

        <Link sx={{ mr: 2, flexGrow: 1 }} to={STUDENT_PLANS_URL(id)}>
          <Button data-cy="edit" variant="outline" sx={{ width: "100%" }}>
            <Icon as={CalendarIcon} fill="textPrimary" mr={2} />
            <Trans>Plans</Trans>
          </Button>
        </Link>

        <Link sx={{ flexGrow: 1 }} to={STUDENT_IMAGES_URL(id)}>
          <Button data-cy="edit" variant="outline" sx={{ width: "100%" }}>
            <Icon as={ImageIcon} fill="textPrimary" mr={2} />
            <Trans>Gallery</Trans>
          </Button>
        </Link>
      </Flex>

      <Flex m={3} my={2} mb={4}>
        <Link sx={{ width: "100%" }} to={NEW_OBSERVATION_URL(id)}>
          <Button sx={{ width: "100%" }}>
            <Icon as={PlusIcon} mr={2} fill="onPrimary" />
            <Trans>Observation</Trans>
          </Button>
        </Link>
      </Flex>

      <DailyObservationCard key={id} studentId={id} />

      <StudentProgressSummaryCard studentId={id} mx={[0, 3]} mt={4} />
    </Box>
  )
}

export default PageStudentOverview
