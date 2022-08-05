import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { useGetSchools } from "../../hooks/api/schools/useGetSchools"
import { setSchoolIdState } from "../../hooks/schoolIdState"
import { ReactComponent as ArrowNextIcon } from "../../icons/next-arrow.svg"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import { STUDENTS_URL } from "../../routes"
import BrandBanner from "../BrandBanner/BrandBanner"
import Icon from "../Icon/Icon"
import { Link, navigate } from "../Link/Link"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { Typography } from "../Typography/Typography"

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
      <Trans>
        Welcome!! Create your first school or use an invitation link to join an
        existing school.
      </Trans>
    </Typography.Body>
  )

  return (
    <Box>
      <BrandBanner />
      <Box mx="auto" p={3} sx={{ maxWidth: "maxWidth.xsm", width: "100%" }}>
        <Typography.H5 mb={3} sx={{ fontWeight: "bold" }}>
          <Trans>Your Schools</Trans>
        </Typography.H5>
        {schools.isLoading && <LoadingState />}
        {availableSchools}
        {emptySchoolPlaceholder}
        <Link to="/new-school">
          <Button mt={3} sx={{ width: "100%" }} data-cy="newSchool">
            <Icon as={PlusIcon} mr={2} />
            <Trans>New school</Trans>
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
