import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { FC, useState } from "react"
import { Box, Button, Flex, Image, Text } from "theme-ui"
import { Class } from "../../../../__generated__/models"
import { borderBottom, borderFull } from "../../../../border"
import AlertDialog from "../../../../components/AlertDialog/AlertDialog"
import EditReportSideBar from "../../../../components/EditReportSideBar/EditReportSideBar"
import Icon from "../../../../components/Icon/Icon"
import { Link } from "../../../../components/Link/Link"
import SearchBar from "../../../../components/SearchBar/SearchBar"
import SEO from "../../../../components/seo"
import StudentPicturePlaceholder from "../../../../components/StudentPicturePlaceholder/StudentPicturePlaceholder"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../components/TranslucentBar/TranslucentBar"
import useGetReport from "../../../../hooks/api/reports/useGetProgressReport"
import usePostReportPublished from "../../../../hooks/api/reports/usePostReportPublished"
import { useQueryString } from "../../../../hooks/useQueryString"
import useVisibilityState from "../../../../hooks/useVisibilityState"
import { ReactComponent as EditIcon } from "../../../../icons/edit.svg"
import { ALL_REPORT_URL, STUDENT_REPORT_URL } from "../../../../routes"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const { data: report } = useGetReport(reportId)

  const [search, setSearch] = useState("")
  const [editReport, setEditReport] = useState(false)

  let reportsDone = 0
  report?.studentsReports.forEach(({ ready }) => {
    if (ready) reportsDone += 1
  })

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <SEO title="Progress Reports" />

      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          containerSx={{ ...borderBottom }}
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(report?.title),
          ]}
        />

        <Flex
          pt={[3, 2]}
          pb={2}
          sx={{
            minHeight: [133, 66],
            flexDirection: ["column", "row"],
            alignItems: ["start", "baseline"],
          }}
        >
          <Text ml={3} pb={[1, 0]} sx={{ fontWeight: "bold" }}>
            {report?.title}
          </Text>

          <Text
            ml={3}
            mr="auto"
            color="textMediumEmphasis"
            sx={{ fontSize: 0 }}
          >
            {report?.periodStart?.format("DD MMMM YYYY - ")}
            {report?.periodEnd?.format("DD MMMM YYYY")}
          </Text>

          {report && (
            <Flex
              mt={[3, 0]}
              sx={{ width: ["100%", "auto"], alignItems: "center" }}
            >
              <Text
                pr={3}
                m={3}
                color="textMediumEmphasis"
                sx={{ fontSize: 0, display: "block" }}
                mr="auto"
              >
                <Trans>
                  {reportsDone} out of {report?.studentsReports?.length} done
                </Trans>
              </Text>

              <Button
                variant="outline"
                mr={2}
                p={0}
                onClick={() => setEditReport(true)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 32,
                  width: 32,
                }}
              >
                <Icon as={EditIcon} size={18} />
              </Button>

              {report.published && <UnPublishButton reportId={reportId} />}
              {!report.published && <PublishButton reportId={reportId} />}
            </Flex>
          )}
        </Flex>
      </TranslucentBar>

      <Flex p={3} sx={{ ...borderBottom }}>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      </Flex>

      {report?.studentsReports
        ?.filter(({ student }) => student.name.match(new RegExp(search, "i")))
        ?.map(
          ({
            ready,
            areaComments,
            generalComments,
            student: { id, name, classes },
          }) => (
            <Student
              key={id}
              reportId={reportId}
              studentId={id}
              name={name}
              classes={classes}
              ready={ready}
              generalComments={generalComments}
              areaComments={areaComments}
            />
          )
        )}

      {report && (
        <EditReportSideBar
          reportId={reportId}
          periodStart={report.periodStart}
          periodEnd={report.periodEnd}
          title={report.title}
          open={editReport}
          onClose={() => setEditReport(false)}
        />
      )}
    </Box>
  )
}

const Student: FC<{
  image?: string
  reportId: string
  studentId: string
  name: string
  classes: Class[]
  ready: boolean
  generalComments: string
  areaComments: object[]
}> = ({
  image,
  name,
  reportId,
  studentId,
  classes,
  ready,
  generalComments = "",
  areaComments,
}) => {
  const inProgress = generalComments !== "" && areaComments.length === 0

  let color = "red"
  let text = "Empty"
  if (inProgress) {
    color = "#ffd600"
    text = "In Progress"
  }
  if (ready) {
    color = "primaryDark"
    text = "Ready"
  }

  return (
    <Link
      to={STUDENT_REPORT_URL(reportId, studentId)}
      sx={{
        height: "48px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        ...borderBottom,
        "&:hover": {
          backgroundColor: "primaryLightest",
        },
      }}
    >
      {image ? (
        <Image src={image} sx={{ ml: 3, width: 18, flexShrink: 0 }} />
      ) : (
        <StudentPicturePlaceholder sx={{ ml: 3, width: 18, flexShrink: 0 }} />
      )}

      <Text mr="auto" px={3} className="truncate">
        {name}
      </Text>

      {classes?.map((c) => (
        <Text
          key={c.id}
          mr={2}
          color="textMediumEmphasis"
          py={0}
          px={2}
          sx={{
            ...borderFull,
            fontSize: 0,
            borderRadius: "circle",
            backgroundColor: "background",
            display: ["none", "block"],
            flexShrink: 0,
          }}
        >
          {c.name}
        </Text>
      ))}

      <Flex
        mr={3}
        py={0}
        px={2}
        sx={{
          ...borderFull,
          borderRadius: "circle",
          backgroundColor: "background",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div
          sx={{
            mr: "8px",
            width: "6px",
            height: "6px",
            backgroundColor: color,
            borderRadius: "circle",
            color: "textMediumEmphasis",
          }}
        />

        <Text sx={{ fontSize: 0 }}>{text}</Text>
      </Flex>
    </Link>
  )
}

const UnPublishButton: FC<{
  reportId: string
}> = ({ reportId }) => {
  const { i18n } = useLingui()
  const patchReport = usePostReportPublished(reportId)
  const confirmationDialog = useVisibilityState()

  const handlePublish = async () => {
    await patchReport.mutate({
      published: false,
    })
    confirmationDialog.hide()
  }

  return (
    <>
      <Button
        variant="outline"
        mr={3}
        onClick={confirmationDialog.show}
        sx={{
          color: "danger",
          "&:hover": {
            backgroundColor: "tintDanger",
            borderColor: "danger",
          },
          "&:focus": {
            backgroundColor: "tintDanger",
            borderColor: "danger",
          },
        }}
      >
        <Trans>Unpublish</Trans>
      </Button>
      {confirmationDialog.visible && (
        <AlertDialog
          title={i18n._(t`Unpublish report?`)}
          body={i18n._(
            t`Parents / guardians will be unable to see these report anymore.`
          )}
          positiveText={i18n._(t`Unpublish`)}
          onPositiveClick={handlePublish}
          onNegativeClick={confirmationDialog.hide}
        />
      )}
    </>
  )
}

const PublishButton: FC<{
  reportId: string
}> = ({ reportId }) => {
  const { i18n } = useLingui()
  const patchReport = usePostReportPublished(reportId)
  const confirmationDialog = useVisibilityState()

  const handlePublish = async () => {
    await patchReport.mutate({
      published: true,
    })
    confirmationDialog.hide()
  }

  return (
    <>
      <Button mr={3} onClick={confirmationDialog.show}>
        <Trans>Publish</Trans>
      </Button>

      {confirmationDialog.visible && (
        <AlertDialog
          title={i18n._(t`Publish report?`)}
          body={i18n._(
            // TODO: add learn more link to doc later.
            t`This will publish report to parents / guardians. Observations and assessments included in these reports will be frozen.`
          )}
          positiveText={i18n._(t`Publish`)}
          onPositiveClick={handlePublish}
          onNegativeClick={confirmationDialog.hide}
        />
      )}
    </>
  )
}

export default ManageReports
