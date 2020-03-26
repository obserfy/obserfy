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
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { NEW_STUDENT_URL } from "../../pages/dashboard/observe/students/new"

export const PageHome: FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const students = useGetStudents()

  const matchedStudent = !students.error
    ? students.data?.filter((student) => {
        student.name.match(new RegExp(searchTerm, "i"))
      })
    : []

  const studentList =
    students.status === "success" &&
    matchedStudent?.map(({ name, id }) => (
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

  const emptyData =
    students.status === "success" && (students.data?.length ?? 0) === 0

  const emptySearchResult =
    students.status === "success" &&
    matchedStudent?.length === 0 &&
    searchTerm !== ""

  return (
    <Box maxWidth="maxWidth.sm" margin="auto">
      <Flex p={3}>
        <SearchBar
          mr={3}
          placeholder="Search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to={NEW_STUDENT_URL} style={{ flexShrink: 0 }}>
          <Button variant="outline" data-cy="addStudent" height="100%">
            <Icon as={PlusIcon} m={0} />
          </Button>
        </Link>
      </Flex>
      {studentList}
      {emptySearchResult && <EmptySearchResultPlaceholder term={searchTerm} />}
      {emptyData && <NoStudentPlaceholder />}
      {students.status === "loading" && <StudentLoadingPlaceholder />}
      {students.status === "error" && (
        <>
          <Typography.Body textAlign="center" mx={4} mb={3}>
            Oops, we fail to fetch new student data. Please try again in a
            minute.
          </Typography.Body>
          <Button mx="auto" onClick={students.refetch}>
            Try again
          </Button>
        </>
      )}
    </Box>
  )
}

const EmptySearchResultPlaceholder: FC<{ term: string }> = ({ term }) => (
  <Flex mt={3} alignItems="center" justifyContent="center" height="100%">
    <Typography.H6 textAlign="center" maxWidth="80vw">
      The term <i>&quot;{term}&quot;</i> does not match any student
    </Typography.H6>
  </Flex>
)

const NoStudentPlaceholder: FC = () => (
  <Card mx={3}>
    <Flex
      m={3}
      px={4}
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
    >
      <Typography.Body mb={4} mt={3} textAlign="center">
        You have no student enrolled
      </Typography.Body>
      <Link to={NEW_STUDENT_URL} data-cy="new-student-button">
        <Button variant="outline">
          <Icon as={PlusIcon} m={0} mr={2} />
          New Student
        </Button>
      </Link>
    </Flex>
  </Card>
)

const StudentLoadingPlaceholder: FC = () => (
  <Box px={3}>
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
    <LoadingPlaceholder width="100%" height={62} mb={2} />
  </Box>
)

export default PageHome
