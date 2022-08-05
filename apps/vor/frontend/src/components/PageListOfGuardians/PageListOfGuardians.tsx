import { t, Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import { borderTop } from "../../border"
import { useGetSchoolGuardians } from "../../hooks/api/guardians/useGetSchoolGuardians"
import { ReactComponent as ChevronRight } from "../../icons/next-arrow.svg"
import {
  ADMIN_URL,
  GUARDIAN_PROFILE_URL,
  NEW_GUARDIAN_ADMIN_URL,
} from "../../routes"
import Icon from "../Icon/Icon"
import { Link } from "../Link/Link"
import SearchBar from "../SearchBar/SearchBar"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"

export const PageListOfGuardians: FC = () => {
  const guardians = useGetSchoolGuardians()
  const [searchTerm, setSearchTerm] = useState("")
  const filteredGuardians = guardians.data?.filter((guardian) =>
    guardian.name.match(new RegExp(searchTerm, "i"))
  )

  return (
    <Box sx={{ maxWidth: "maxWidth.lg" }} mx="auto" pb={5}>
      <TopBar
        breadcrumbs={[
          breadCrumb(t`Admin`, ADMIN_URL),
          breadCrumb(t`All Guardians`),
        ]}
      />

      <Card mx={[0, 3]} sx={{ borderRadius: [0, "default"] }}>
        <Flex sx={{ alignItems: "center" }}>
          <Typography.H6 m={3}>
            <Trans>All Guardians</Trans>
          </Typography.H6>

          <Link to={NEW_GUARDIAN_ADMIN_URL} sx={{ ml: "auto", mr: 3 }}>
            <Button variant="text" data-cy="addGuardian">
              <Trans>Create New</Trans>
            </Button>
          </Link>
        </Flex>

        <Flex p={3} pt={0}>
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ backgroundColor: "background" }}
          />
        </Flex>
        {filteredGuardians?.map(({ id, name, email, phone }) => (
          <GuardianCard
            key={id}
            guardianId={id}
            name={name}
            email={email}
            phone={phone}
          />
        ))}
      </Card>
    </Box>
  )
}

const GuardianCard: FC<{
  guardianId: string
  name: string
  email?: string
  phone?: string
}> = ({ guardianId, name, email, phone }) => {
  return (
    <Link to={GUARDIAN_PROFILE_URL(guardianId)} sx={{ display: "block" }}>
      <Flex
        p={3}
        sx={{
          ...borderTop,
          alignItems: "center",
          transition: "background-color 100ms ease-in-out",
          "&:hover": {
            backgroundColor: "primaryLightest",
          },
        }}
      >
        <Typography.Body sx={{ width: "100%" }}>{name}</Typography.Body>
        <Typography.Body
          py={1}
          mx={2}
          px={email ? 0 : 2}
          backgroundColor={email ? "transparent" : "tintWarning"}
          sx={{
            width: "100%",
            borderRadius: "default",
            fontWeight: email ? "normal" : "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "textMediumEmphasis",
          }}
        >
          {email || <Trans>No email set</Trans>}
        </Typography.Body>

        <Typography.Body
          mx={2}
          py={1}
          px={phone ? 0 : 2}
          backgroundColor={phone ? "transparent" : "tintWarning"}
          sx={{
            display: ["none", "block"],
            width: "100%",
            borderRadius: "default",
            fontWeight: phone ? "normal" : "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: "textMediumEmphasis",
          }}
        >
          {phone || <Trans>No phone set</Trans>}
        </Typography.Body>

        <Icon as={ChevronRight} ml={2} />
      </Flex>
    </Link>
  )
}

export default PageListOfGuardians
