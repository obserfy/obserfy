/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { jsx, Button, Card, Box, Flex, Image } from "theme-ui"
import { Link } from "../Link/Link"

import Chip from "../Chip/Chip"
import Pill from "../Pill/Pill"
import SearchBar from "../SearchBar/SearchBar"

import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { Typography } from "../Typography/Typography"

import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import { useGetStudents } from "../../api/students/useGetStudents"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { NEW_STUDENT_URL, STUDENT_OVERVIEW_PAGE_URL } from "../../routes"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"

export const PageHome: FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const students = useGetStudents(filterClass, true)
  const allClass = useGetSchoolClasses()

  const matchedStudent =
    students.error === null
      ? students.data?.filter((student) => {
          return student.name.match(new RegExp(searchTerm, "i"))
        })
      : []

  const emptyData =
    students.status === "success" && (students.data?.length ?? 0) === 0

  const emptySearchResult =
    students.status === "success" &&
    matchedStudent?.length === 0 &&
    searchTerm !== ""

  const studentList =
    students.status === "success" &&
    matchedStudent?.map(({ profilePicUrl, name, id, classes }) => (
      <Link to={STUDENT_OVERVIEW_PAGE_URL(id)} sx={{ display: "block" }}>
        <Card
          p={3}
          mx={[0, 3]}
          mb={[0, 2]}
          key={id}
          sx={{
            backgroundColor: ["background", "surface"],
            borderRadius: [0, "default"],
            cursor: "pointer",
            boxShadow: ["none", "low"],
            display: "flex",
            alignItems: "center",
          }}
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
          <Box>
            <Typography.Body ml={3}>{name}</Typography.Body>
            <Flex sx={{ flexWrap: "wrap" }} ml={1}>
              {classes?.map(({ className }) => (
                <Pill ml={2} text={className} color="text" />
              ))}
            </Flex>
          </Box>
        </Card>
      </Link>
    ))

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
      <Flex p={3} pt={3} pb={2}>
        <SearchBar
          mr={2}
          placeholder="Search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Link to={NEW_STUDENT_URL} style={{ flexShrink: 0 }}>
          <Button
            variant="outline"
            data-cy="addStudent"
            sx={{
              height: "100%",
            }}
          >
            <Icon as={PlusIcon} m={0} />
          </Button>
        </Link>
      </Flex>
      <Flex px={3} sx={{ flexWrap: "wrap" }}>
        <Chip
          key="all"
          isActive={filterClass === ""}
          text="All"
          activeBackground="primary"
          onClick={() => setFilterClass("")}
        />
        {allClass.data?.map(({ id, name }) => (
          <Chip
            key={id}
            isActive={filterClass === id}
            text={name}
            activeBackground="primary"
            onClick={() => setFilterClass(id)}
          />
        ))}
      </Flex>
      {studentList}
      {emptySearchResult && <EmptySearchResultPlaceholder term={searchTerm} />}
      {emptyData && <NoStudentPlaceholder />}
      {students.status === "loading" && <StudentLoadingPlaceholder />}
      {students.status === "error" && (
        <Fragment>
          <Typography.Body
            sx={{
              textAlign: "center",
            }}
            mx={4}
            mb={3}
          >
            Oops, we fail to fetch new student data. Please try again in a
            minute.
          </Typography.Body>
          <Button mx="auto" onClick={() => students.refetch}>
            Try again
          </Button>
        </Fragment>
      )}
    </Box>
  )
}

const EmptySearchResultPlaceholder: FC<{ term: string }> = ({ term }) => (
  <Flex
    mt={3}
    sx={{
      justifyContent: "center",
      height: "100%",
      alignItems: "center",
    }}
  >
    <Typography.H6
      sx={{
        textAlign: "center",
        maxWidth: "80vw",
      }}
    >
      The term <i>&quot;{term}&quot;</i> does not match any student
    </Typography.H6>
  </Flex>
)

const NoStudentPlaceholder: FC = () => (
  <Card mx={3}>
    <Flex
      m={3}
      px={4}
      sx={{
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Typography.Body
        mb={4}
        mt={3}
        sx={{
          textAlign: "center",
        }}
      >
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
    <LoadingPlaceholder sx={{ width: "50%", height: 30 }} mb={3} />
    <LoadingPlaceholder sx={{ width: "70%", height: 30 }} mb={3} />
    <LoadingPlaceholder sx={{ width: "40%", height: 30 }} mb={3} />
    <LoadingPlaceholder sx={{ width: "60%", height: 30 }} mb={3} />
  </Box>
)

export default PageHome
