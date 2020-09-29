import React, { FC } from "react"
import { navigate } from "gatsby"
import { Button, Box, Card, Flex } from "theme-ui"
import { useGetSchools } from "../../api/schools/useGetSchools"
import { Typography } from "../Typography/Typography"
import Icon from "../Icon/Icon"
import { ReactComponent as ArrowNextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { setSchoolIdState } from "../../hooks/schoolIdState"
import { STUDENTS_URL } from "../../routes"
import BrandBanner from "../BrandBanner/BrandBanner"
import { Link } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"

export const PageChooseSchool: FC = () => {
  const schools = useGetSchools()

  function saveSelectedSchool(schoolId: string): void {
    setSchoolIdState(schoolId)
    navigate(STUDENTS_URL)
  }

  const availableSchools = schools.data?.map(({ id, name }) => (
    <Card
      key={id}
      onClick={() => saveSelectedSchool(id)}
      p={3}
      mb={2}
      sx={{ cursor: "pointer" }}
      data-cy="school_item"
    >
      <Flex sx={{ alignItems: "center" }}>
        <Typography.Body>{name}</Typography.Body>
        <Icon ml="auto" as={ArrowNextIcon} />
      </Flex>
    </Card>
  ))

  const emptySchoolPlaceholder = schools.data?.length === 0 && (
    <Typography.Body mb={4} mt={4}>
      Welcome!! Create your first school or use an invitation link to join an
      existing school.
    </Typography.Body>
  )

  return (
    <Box>
      <BrandBanner />
      <Box mx="auto" p={3} sx={{ maxWidth: "maxWidth.xsm", width: "100%" }}>
        <Typography.H5 mb={3} sx={{ fontWeight: "bold" }}>
          Your Schools
        </Typography.H5>
        {schools.isLoading && <LoadingState />}
        {availableSchools}
        {emptySchoolPlaceholder}
        <Link to="/new-school">
          <Button
            mt={3}
            variant="outlineBig"
            sx={{ width: "100%" }}
            data-cy="newSchool"
          >
            <Icon as={PlusIcon} mr={2} />
            New school
          </Button>
        </Link>
      </Box>
    </Box>
  )
}

const LoadingState: FC = () => (
  <>
    <LoadingPlaceholder sx={{ height: 62 }} mb={2} />
    <LoadingPlaceholder sx={{ height: 62 }} mb={2} />
    <LoadingPlaceholder sx={{ height: 62 }} mb={2} />
  </>
)

export default PageChooseSchool
