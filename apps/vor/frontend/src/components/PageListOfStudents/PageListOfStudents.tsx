/** @jsx jsx */
import { FC, useState } from "react"
import { Box, Card, Flex, jsx } from "theme-ui"
import BackNavigation from "../BackNavigation/BackNavigation"
import { SETTINGS_URL } from "../../routes"
import Typography from "../Typography/Typography"
import { useGetStudents } from "../../api/students/useGetStudents"
import SearchBar from "../SearchBar/SearchBar"
import Pill from "../Pill/Pill"
import AlertDialog from "../AlertDialog/AlertDialog"
import { usePatchStudentApi } from "../../api/students/usePatchStudentApi"

const StatusDataBox: FC<{
  studentId: string
  active: boolean
  name: string
}> = ({ studentId, active, name }) => {
  const [mutate] = usePatchStudentApi(studentId)
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const saveStatus = async () => {
    await mutate({ active: !active })
    setShowStatusDialog(false)
  }
  return (
    <Box>
      <Pill
        onClick={() => setShowStatusDialog(true)}
        mx={0}
        mt={2}
        style={{ width: "fit-content", cursor: "pointer" }}
        text={active ? "active" : "inactive"}
        backgroundColor={active ? "green" : "red"}
        color="white"
      />
      {showStatusDialog && (
        <AlertDialog
          title={`Set as ${active ? "inactive" : "active"}?`}
          negativeText="Cancel"
          positiveText="Yes"
          body={`Are you sure you want to set ${name} as ${
            active ? "inactive" : "active"
          }?`}
          onNegativeClick={() => setShowStatusDialog(false)}
          onPositiveClick={() => saveStatus()}
        />
      )}
    </Box>
  )
}
export const PageListOfStudents: FC = () => {
  const students = useGetStudents()
  const [searchTerm, setSearchTerm] = useState("")
  const filteredStudents = students.data?.filter((student) =>
    student.name.match(new RegExp(searchTerm, "i"))
  )
  return (
    <Flex
      sx={{
        flexDirection: "column",
        maxWidth: "maxWidth.md",
      }}
      mx="auto"
    >
      <BackNavigation to={SETTINGS_URL} text="Settings" />
      <Box px={3} pb={3} pt={2}>
        <SearchBar
          sx={{ width: "100%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {(students.data?.length ?? 0) > 0 && (
        <Flex sx={{ alignItems: "center" }} m={3} mb={4}>
          <Typography.H3
            mr="auto"
            sx={{
              lineHeight: 1,
            }}
          >
            Students
          </Typography.H3>
        </Flex>
      )}
      {filteredStudents?.map(({ id, name, active }) => (
        <Card mx={3} mb={2} p={3}>
          <Typography.Body>{name}</Typography.Body>
          <StatusDataBox studentId={id} active={active} name={name} />
        </Card>
      ))}
    </Flex>
  )
}

export default PageListOfStudents
