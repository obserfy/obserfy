import React, { FC, useState } from "react"
import { navigate } from "gatsby"
import { Link } from "gatsby-plugin-intl3"
import { Box } from "../Box/Box"
import SearchBar from "../SearchBar/SearchBar"
import { Flex } from "../Flex/Flex"
import Icon from "../Icon/Icon"
import Button from "../Button/Button"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { Typography } from "../Typography/Typography"
import Card from "../Card/Card"
import { useGetStudents } from "../../api/students/useGetStudents"
import EmptyListPlaceholder from "../EmptyListPlaceholder/EmptyListPlaceholder"
import { getSchoolId } from "../../hooks/schoolIdState"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import LoadingIndicator from "../LoadingIndicator/LoadingIndicator"

export const PageHome: FC = () => {
  const schoolId = getSchoolId()
  const [searchTerm, setSearchTerm] = useState("")
  const { data, loading } = useGetStudents(schoolId)
  const students = data ?? []
  const matchedStudent = students.filter(student =>
    student.name.match(new RegExp(searchTerm, "i"))
  )

  const studentList = matchedStudent.map(({ name, id }) => (
    <Card
      p={3}
      mx={3}
      mb={2}
      key={id}
      onClick={() => navigate(`/dashboard/observe/students/details?id=${id}`)}
      sx={{ cursor: "pointer" }}
    >
      <Flex>
        <Typography.H6>{name}</Typography.H6>
      </Flex>
    </Card>
  ))

  const emptyStudentListPlaceholder = students.length === 0 && (
    <Box mx={3}>
      <EmptyListPlaceholder
        text="You have no one enrolled"
        callToActionText="New student"
        onActionClick={() => navigate("/dashboard/observe/students/new")}
      />
    </Box>
  )

  const emptyResultInfo = students.length > 0 &&
    matchedStudent?.length === 0 &&
    searchTerm !== "" && (
      <Flex mt={3} alignItems="center" justifyContent="center" height="100%">
        <Typography.H6 textAlign="center" maxWidth="80vw">
          The term <i>&quot;{searchTerm}&quot;</i> does not match any student
        </Typography.H6>
      </Flex>
    )

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <Flex p={3}>
        <SearchBar
          mr={3}
          placeholder="Search students"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Link to="/dashboard/observe/students/new">
          <Button variant="outline" data-cy="addStudent" height="100%">
            <Icon as={PlusIcon} m={0} />
          </Button>
        </Link>
      </Flex>
      {loading && students.length > 0 && (
        <Flex justifyContent="center" mt={-3}>
          <LoadingIndicator size={48} color="primary" />
        </Flex>
      )}
      {(!loading || students.length > 0) && studentList}
      {!loading && emptyResultInfo}
      {!loading && emptyStudentListPlaceholder}
      {loading && students.length === 0 && <StudentListLoadingPlaceholder />}
    </Box>
  )
}

const StudentListLoadingPlaceholder: FC = () => (
  <Box px={3}>
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
  </Box>
)

export default PageHome
