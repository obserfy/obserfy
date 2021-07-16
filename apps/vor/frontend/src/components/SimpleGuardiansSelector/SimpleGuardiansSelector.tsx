import { Trans } from "@lingui/macro"
import { FC, useState } from "react"
import { Box, Card, Flex } from "theme-ui"
import { useGetSchoolGuardians } from "../../hooks/api/guardians/useGetSchoolGuardians"
import { borderTop } from "../../border"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import SearchBar from "../SearchBar/SearchBar"
import { Typography } from "../Typography/Typography"

export interface SimpleGuardiansSelectorProps {
  selectedId: string
  onChange: (value: string) => void
  currentGuardianIds?: string[]
}
const SimpleGuardiansSelector: FC<SimpleGuardiansSelectorProps> = ({
  selectedId,
  onChange,
  currentGuardianIds = [],
}) => {
  const { data: guardians, isLoading } = useGetSchoolGuardians()

  const [filter, setFilter] = useState("")

  return (
    <Box pb={4}>
      <Card mt={3} mx={[0, 3]} sx={{ borderRadius: [0, "default"] }}>
        <Box p={3}>
          <SearchBar
            sx={{ backgroundColor: "background" }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Box>

        {isLoading && <GuardianListLoadingPlaceholder />}

        {guardians
          ?.filter(
            ({ id, name }) =>
              name.match(new RegExp(filter, "i")) &&
              !currentGuardianIds.includes(id)
          )
          .map(({ id, name, email }) => (
            <Flex
              pl={3}
              pr={2}
              py={2}
              key={id}
              onClick={() => onChange(id)}
              sx={{
                ...borderTop,
                alignItems: "center",
                cursor: "pointer",
                backgroundColor: id === selectedId ? "primaryLight" : undefined,
                "&:hover": {
                  backgroundColor:
                    id === selectedId ? "primaryLight" : "primaryLightest",
                },
                transition: "background-color 150ms ease-in-out",
              }}
            >
              <Typography.Body sx={{ width: "100%" }}>{name}</Typography.Body>
              <Typography.Body
                py={1}
                px={email ? 0 : 2}
                backgroundColor={email ? "transparent" : "tintWarning"}
                color="textMediumEmphasis"
                sx={{
                  width: "100%",
                  borderRadius: "default",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  fontWeight: email ? "normal" : "bold",
                }}
              >
                {email || <Trans>No email set</Trans>}
              </Typography.Body>
            </Flex>
          ))}
      </Card>
    </Box>
  )
}

const GuardianListLoadingPlaceholder = () => (
  <Box>
    <LoadingPlaceholder sx={{ height: 34 }} m={3} mt={0} />
    <LoadingPlaceholder sx={{ height: 34 }} m={3} />
    <LoadingPlaceholder sx={{ height: 34 }} m={3} />
    <LoadingPlaceholder sx={{ height: 34 }} m={3} />
    <LoadingPlaceholder sx={{ height: 34 }} m={3} />
    <LoadingPlaceholder sx={{ height: 34 }} m={3} />
    <LoadingPlaceholder sx={{ height: 34 }} m={3} />
  </Box>
)

export default SimpleGuardiansSelector
