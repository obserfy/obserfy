import React, { FC, useState } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import Typography from "../Typography/Typography"
import LoadingPlaceholder from "../LoadingPlaceholder/LoadingPlaceholder"
import { useGetCurriculum } from "../../api/useGetCurriculum"
import { useGetCurriculumAreas } from "../../api/useGetCurriculumAreas"
import { ReactComponent as PlusIcon } from "../../icons/plus.svg"
import Icon from "../Icon/Icon"
import NewAreaDialog from "../NewAreaDialog/NewAreaDialog"
import { ADMIN_URL, CURRICULUM_AREA_URL } from "../../routes"
import TopBar from "../TopBar/TopBar"
import usePostNewCurriculum from "../../api/curriculum/usePostNewCurriculum"
import NewCustomCurriculumDialog from "../NewCustomCurriculumDialog/NewCustomCurriculumDialog"
import { ReactComponent as NextIcon } from "../../icons/next-arrow.svg"
import { Link } from "../Link/Link"
import { borderBottom } from "../../border"
import { ReactComponent as DeleteIcon } from "../../icons/trash.svg"
import { ReactComponent as EditIcon } from "../../icons/edit.svg"
import DeleteCurriculumDialog from "../DeleteCurriculumDialog/DeleteCurriculumDialog"

export const PageCurriculumSettings: FC = () => {
  const { data, isLoading, isError, isSuccess } = useGetCurriculum()
  const [showCurriculumDeleteDialog, setShowCurriculumDeleteDialog] = useState(
    false
  )

  return (
    <>
      <Box sx={{ maxWidth: "maxWidth.sm" }} margin="auto">
        <TopBar
          breadcrumbs={[
            {
              text: "Admin",
              to: ADMIN_URL,
            },
            {
              text: "Curriculum",
            },
          ]}
        />
        {isLoading && <LoadingState />}
        {isSuccess && data?.name && (
          <Flex mx={3} mt={3} sx={{ alignItems: "baseline" }}>
            {isLoading && !data?.name ? (
              <LoadingPlaceholder sx={{ width: "10rem", height: 43 }} />
            ) : (
              <Typography.H4 sx={{ lineHeight: 1.2 }}>
                {data?.name}
              </Typography.H4>
            )}
            <Button
              variant="secondary"
              onClick={() => setShowCurriculumDeleteDialog(true)}
              color="danger"
              sx={{ flexShrink: 0 }}
              px={2}
              ml={2}
            >
              <Icon as={DeleteIcon} fill="danger" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => {}}
              sx={{ flexShrink: 0 }}
              px={2}
            >
              <Icon as={EditIcon} />
            </Button>
          </Flex>
        )}
        {isSuccess && data && <CurriculumAreas curriculum={data} />}
        {isError && <SetupCurriculum />}
        {showCurriculumDeleteDialog && (
          <DeleteCurriculumDialog
            onDismiss={() => setShowCurriculumDeleteDialog(false)}
            name={data?.name ?? ""}
          />
        )}
      </Box>
    </>
  )
}

const SetupCurriculum: FC = () => {
  const [postNewCurriculum] = usePostNewCurriculum()
  const [showCustomCurriculumDialog, setShowCustomCurriculumDialog] = useState(
    false
  )

  return (
    <>
      <Typography.H6 my={2} sx={{ textAlign: "center" }}>
        Setup curriculum
      </Typography.H6>
      <Flex p={3} sx={{ flexFlow: ["column", "row"] }}>
        <Card p={3} mr={[0, 3]} mb={[3, 0]} sx={{ width: [undefined, "50%"] }}>
          <Typography.H6 mb={2}>Montessori</Typography.H6>
          <Typography.Body mb={3}>
            Start with a basic Montessori Curriculum that you can modify to your
            needs.
          </Typography.Body>
          <Button
            variant="outline"
            onClick={() => postNewCurriculum({ template: "montessori" })}
          >
            Use Montessori
          </Button>
        </Card>
        <Card p={3} sx={{ width: [undefined, "50%"] }}>
          <Typography.H6 mb={2}>Custom</Typography.H6>
          <Typography.Body mb={3}>
            Start with a blank curriculum that you can customize from scratch.
          </Typography.Body>
          <Button
            variant="outline"
            onClick={() => setShowCustomCurriculumDialog(true)}
          >
            Use Custom
          </Button>
        </Card>
      </Flex>
      {showCustomCurriculumDialog && (
        <NewCustomCurriculumDialog
          onDismiss={() => setShowCustomCurriculumDialog(false)}
        />
      )}
    </>
  )
}

const CurriculumAreas: FC<{
  curriculum: { id: string }
}> = ({ curriculum }) => {
  const [showNewAreaDialog, setShowNewAreaDialog] = useState(false)
  const areas = useGetCurriculumAreas()

  return (
    <Box mx={[0, 3]} mt={3}>
      <Flex mx={[3, 0]} mb={2} sx={{ alignItems: "center" }}>
        <Typography.H6>Areas</Typography.H6>
        <Button
          ml="auto"
          variant="outline"
          onClick={() => setShowNewAreaDialog(true)}
        >
          <Icon as={PlusIcon} mr={2} />
          New Area
        </Button>
      </Flex>
      {areas.data?.map((area) => (
        <Link
          key={area.id}
          to={CURRICULUM_AREA_URL(area.id)}
          sx={{ display: "block" }}
        >
          <Card
            p={3}
            mb={[0, 2]}
            sx={{
              borderRadius: [0, "default"],
              ...borderBottom,
              borderBottomStyle: ["solid", "none"],
            }}
          >
            <Flex sx={{ alignItems: "center" }}>
              <Typography.Body sx={{ fontSize: [2, 2] }}>
                {area.name}
              </Typography.Body>
              <Icon as={NextIcon} ml="auto" />
            </Flex>
          </Card>
        </Link>
      ))}
      {showNewAreaDialog && (
        <NewAreaDialog
          curriculumId={curriculum.id}
          onDismiss={() => setShowNewAreaDialog(false)}
        />
      )}
    </Box>
  )
}

const LoadingState: FC = () => (
  <Box p={3}>
    <LoadingPlaceholder sx={{ width: "100%", height: "5rem" }} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
    <LoadingPlaceholder sx={{ width: "100%", height: "6rem" }} mt={3} />
  </Box>
)

export default PageCurriculumSettings
