/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Card, Flex, Image, jsx } from "theme-ui"
import { i18nMark } from "@lingui/core"
import { Trans } from "@lingui/macro"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../routes"
import Typography from "../Typography/Typography"
import { useGetAllStudents } from "../../api/students/useGetAllStudents"
import SearchBar from "../SearchBar/SearchBar"
import Pill from "../Pill/Pill"
import AlertDialog from "../AlertDialog/AlertDialog"
import { usePatchStudentApi } from "../../api/students/usePatchStudentApi"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"

export const PageListOfStudents: FC = () => {
  const students = useGetAllStudents()
  const [searchTerm, setSearchTerm] = useState("")
  const filteredStudents = students.data?.filter((student) =>
    student.name.match(new RegExp(searchTerm, "i"))
  )
  return (
    <Box
      sx={{
        flexDirection: "column",
        maxWidth: "maxWidth.md",
      }}
      mx="auto"
    >
      <BackNavigation to={SETTINGS_URL} text={i18nMark("Settings")} />
      <Typography.H5 m={3} sx={{ lineHeight: 1 }}>
        <Trans>All Students</Trans>
      </Typography.H5>
      <Box px={3} pb={2} pt={2}>
        <SearchBar
          sx={{ width: "100%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {filteredStudents?.map(({ id, name, active, profileImageUrl }) => (
        <StudentCard
          key={id}
          profilePicUrl={profileImageUrl}
          name={name}
          active={active}
          studentId={id}
        />
      ))}
    </Box>
  )
}

const StudentCard: FC<{
  studentId: string
  active: boolean
  name: string
  profilePicUrl?: string
}> = ({ studentId, active, name, profilePicUrl }) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const saveStatus = async () => {
    await mutate({ active: !active })
    setShowStatusDialog(false)
  }
  const setActiveText = i18nMark("Set as active?")
  const setInactiveText = i18nMark("Set as inactive?")
  return (
    <Card
      p={3}
      mx={[0, 3]}
      mb={[0, 2]}
      sx={{
        backgroundColor: ["background", "surface"],
        borderRadius: [0, "default"],
        cursor: "pointer",
        boxShadow: ["none", "low"],
        display: "flex",
        alignItems: "center",
      }}
      onClick={() => setShowStatusDialog(true)}
    >
      {profilePicUrl ? (
        <Image
          src={profilePicUrl}
          sx={{
            width: 32,
            height: 32,
            borderRadius: "circle",
          }}
        />
      ) : (
        <StudentPicturePlaceholder />
      )}
      <Flex sx={{ flexDirection: "column", alignItems: "start" }}>
        <Typography.Body ml={3} mb={2} sx={{ lineHeight: 1.6 }}>
          {name}
        </Typography.Body>
        <Pill
          style={{ width: "fit-content", cursor: "pointer" }}
          text={active ? i18nMark("active") : i18nMark("inactive")}
          backgroundColor={active ? "primary" : "warning"}
          color={active ? "onPrimary" : "onWarning"}
          mx={3}
        />
      </Flex>
      {showStatusDialog && (
        <AlertDialog
          title={active ? setInactiveText : setActiveText}
          negativeText={i18nMark("Cancel")}
          positiveText={i18nMark("Yes")}
          body={`Are you sure you want to set ${name} as ${
            active ? "inactive" : "active"
          }?`}
          onNegativeClick={() => setShowStatusDialog(false)}
          onPositiveClick={() => saveStatus()}
        />
      )}
    </Card>
  )
}

export default PageListOfStudents
