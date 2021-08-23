import { t, Trans } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { ChangeEvent, FC, useState } from "react"
import { Box, Checkbox, Flex, Label, Text } from "theme-ui"
import { borderFull } from "../../border"
import dayjs from "../../dayjs"
import usePostNewProgressReport from "../../hooks/api/schools/usePostNewProgressReport"
import { useGetAllStudents } from "../../hooks/api/students/useGetAllStudents"
import { ALL_REPORT_URL } from "../../routes"
import DateInput from "../DateInput/DateInput"
import Input from "../Input/Input"
import { navigate } from "../Link/Link"
import RadioGroup from "../RadioGroup/RadioGroup"
import { breadCrumb } from "../TopBar/TopBar"
import TopBarWithAction from "../TopBarWithAction/TopBarWithAction"

enum StudentOption {
  ALL,
  CUSTOM,
}

const PageNewReport: FC = () => {
  const { i18n } = useLingui()
  const [title, setTitle] = useState("")
  const [periodStart, setPeriodStart] = useState(dayjs())
  const [periodEnd, setPeriodEnd] = useState(dayjs())
  const [studentOption, setStudentOption] = useState(StudentOption.ALL)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const postReport = usePostNewProgressReport()

  return (
    <Flex sx={{ flexDirection: "column" }}>
      <TopBarWithAction
        breadcrumbs={[
          breadCrumb(t`Reports`, ALL_REPORT_URL),
          breadCrumb(t`New Progress Report`),
        ]}
        actionText={t`Create`}
        disableAction={title === ""}
        isLoading={postReport.isLoading}
        onActionClick={async () => {
          const result = await postReport.mutateAsync({
            title,
            periodEnd: periodEnd.toISOString(),
            periodStart: periodEnd.toISOString(),
          })
          if (result?.ok) {
            navigate(ALL_REPORT_URL)
          }
        }}
      >
        <Flex sx={{ alignItems: "center", maxWidth: "maxWidth.sm" }} mx="auto">
          <Text m={3} sx={{ fontWeight: "bold", fontSize: 2 }}>
            <Trans>New Progress Report</Trans>
          </Text>
        </Flex>
      </TopBarWithAction>

      <Box mx="auto" sx={{ maxWidth: "maxWidth.sm", width: "100%" }}>
        <Input
          containerSx={{ px: 3, pt: 3 }}
          label={t`Title*`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Flex p={3} sx={{ flexDirection: ["column", "row"] }} mb={2}>
          <DateInput
            label={t`Period Start`}
            containerSx={{ mr: [0, 3], flexGrow: 1 }}
            value={periodStart}
            onChange={setPeriodStart}
          />
          <DateInput
            label={t`Period End`}
            onChange={setPeriodEnd}
            value={periodEnd}
            containerSx={{ mt: [3, 0], flexGrow: 1 }}
          />
        </Flex>

        <RadioGroup
          name="Included students"
          value={studentOption}
          onChange={(e) => setStudentOption(e)}
          options={[
            {
              label: i18n._(t`All Student`),
              description: i18n._(t`Include all students into this report.`),
            },
            {
              label: i18n._(t`Custom`),
              description: i18n._(t`Select students to be included manually.`),
            },
          ]}
        />
        {StudentOption.CUSTOM === studentOption && (
          <StudentSelector
            selectedIds={selectedStudents}
            setSelectedIds={setSelectedStudents}
          />
        )}
      </Box>
    </Flex>
  )
}

const StudentSelector: FC<{
  selectedIds: string[]
  setSelectedIds: (students: string[]) => void
}> = ({ selectedIds, setSelectedIds }) => {
  const { data: students } = useGetAllStudents("", true)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds([...selectedIds, e.target.value])
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== e.target.value))
    }
  }

  return (
    <Box
      mt={2}
      mx={3}
      py={2}
      sx={{
        backgroundColor: "surface",
        ...borderFull,
        borderRadius: "default",
      }}
    >
      {students?.map((student) => (
        <Label
          as="label"
          key={student.id}
          px={3}
          py={2}
          sx={{
            alignItems: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "primaryLightest",
            },
          }}
        >
          <Checkbox
            sx={{ mr: 3 }}
            value={student.id}
            checked={selectedIds.includes(student.id)}
            onChange={handleChange}
          />
          <Text>{student.name}</Text>
        </Label>
      ))}
    </Box>
  )
}

export default PageNewReport
