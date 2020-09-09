/** @jsx jsx */
import { FC, Fragment, useState } from "react"
import { Box, Button, Card, Flex, Image, jsx } from "theme-ui"
import { useGetAllStudents } from "../../api/students/useGetAllStudents"
import useGetSchoolClasses from "../../api/classes/useGetSchoolClasses"
import { Link } from "../Link/Link"
import { NEW_STUDENT_URL, STUDENT_OVERVIEW_PAGE_URL } from "../../routes"
import StudentPicturePlaceholder from "../StudentPicturePlaceholder/StudentPicturePlaceholder"
import { Typography } from "../Typography/Typography"
import SearchBar from "../SearchBar/SearchBar"
import Icon from "../Icon/Icon"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Chip from "../Chip/Chip"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useQueryString } from "../../hooks/useQueryString"

export const StudentsList: FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const students = useGetAllStudents(filterClass, true)
  const allClass = useGetSchoolClasses()

  const matches = !students.isError
    ? students.data?.filter((student) =>
        student.name.match(new RegExp(searchTerm, "i"))
      )
    : []

  const noStudents =
    students.isSuccess && students.data && students.data.length === 0

  const noSearchResult =
    students.isSuccess && matches?.length === 0 && searchTerm !== ""

  const studentList =
    students.isSuccess &&
    matches?.map(({ profileImageUrl, name, id, classes }) => (
      <StudentListItem
        key={id}
        id={id}
        name={name}
        profileImageUrl={profileImageUrl}
        classes={classes}
      />
    ))

  return (
    <Box>
      <Flex p={3} pt={3} pb={2}>
        <SearchBar
          mr={2}
          placeholder="Search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "100%" }}
        />
        <Link to={NEW_STUDENT_URL} style={{ flexShrink: 0 }}>
          <Button
            variant="outline"
            data-cy="addStudent"
            sx={{ height: "100%" }}
            px={2}
          >
            <Icon as={PlusIcon} />
          </Button>
        </Link>
      </Flex>
      <Flex px={3} sx={{ flexWrap: "wrap" }}>
        <Chip
          mr={2}
          mb={2}
          key="all"
          isActive={filterClass === ""}
          text="All"
          activeBackground="primary"
          onClick={() => setFilterClass("")}
        />
        {allClass.data?.map(({ id, name }) => (
          <Chip
            mr={2}
            mb={2}
            key={id}
            isActive={filterClass === id}
            text={name}
            activeBackground="primary"
            onClick={() => setFilterClass(id)}
          />
        ))}
      </Flex>
      {studentList}
      {noSearchResult && <EmptySearchResultPlaceholder term={searchTerm} />}
      {noStudents && <NoStudentPlaceholder />}
      {students.isLoading && <StudentLoadingPlaceholder />}
      {students.isError && (
        <Fragment>
          <Typography.Body sx={{ textAlign: "center" }} mx={4} mb={3}>
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
  <Flex m={3}>
    <Typography.H6 sx={{ textAlign: "center", maxWidth: "80vw" }}>
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
      <Typography.Body mb={4} mt={3} sx={{ textAlign: "center" }}>
        You have no student enrolled
      </Typography.Body>
      <Link to={NEW_STUDENT_URL} data-cy="new-student-button">
        <Button variant="outline">
          <Icon as={PlusIcon} mr={2} />
          New Student
        </Button>
      </Link>
    </Flex>
  </Card>
)

const StudentLoadingPlaceholder: FC = () => (
  <Box px={3}>
    {[1, 2, 3, 4, 5].map(() => (
      <Flex sx={{ alignItems: "center" }} py={2}>
        <LoadingPlaceholder
          sx={{ width: 32, height: 32, borderRadius: "circle" }}
          mb={2}
        />
        <Box ml={3}>
          <LoadingPlaceholder sx={{ width: "10rem", height: 22 }} mb={2} />
          <LoadingPlaceholder sx={{ width: "4rem", height: 22 }} />
        </Box>
      </Flex>
    ))}
  </Box>
)

const StudentListItem: FC<{
  id: string
  name: string
  profileImageUrl?: string
  classes: Array<{
    classId: string
    className: string
  }>
}> = ({ id, profileImageUrl, name, classes }) => {
  const studentId = useQueryString("studentId")
  const selected = studentId === id

  return (
    <Link
      to={STUDENT_OVERVIEW_PAGE_URL(id)}
      sx={{
        display: "block",
      }}
    >
      <Box
        px={3}
        py={2}
        sx={{
          display: "flex",
          alignItems: "center",
          borderRightColor: "primaryDark",
          borderRightWidth: 2,
          borderRightStyle: selected ? "solid" : "none",
          backgroundColor: selected ? "primaryLightest" : "transparent",
          "&:hover": {
            backgroundColor: "primaryLight",
          },
        }}
      >
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "circle",
            }}
          />
        ) : (
          <StudentPicturePlaceholder />
        )}
        <Box ml={3} py={1}>
          <Typography.Body sx={{ lineHeight: 1.6 }}>{name}</Typography.Body>
          <Flex sx={{ flexWrap: "wrap" }}>
            {classes?.map(({ className }) => (
              <Typography.Body
                mt={1}
                mr={2}
                mb={1}
                color="textMediumEmphasis"
                sx={{ lineHeight: 1, fontSize: 1 }}
              >
                {className}
              </Typography.Body>
            ))}
          </Flex>
        </Box>
      </Box>
    </Link>
  )
}

export default StudentsList
