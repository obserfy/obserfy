import { Trans } from "@lingui/macro"
import { FC } from "react"
import { Box, Button, Card, Flex } from "theme-ui"
import usePostNewCurriculum from "../../hooks/api/curriculum/usePostNewCurriculum"
import useVisibilityState from "../../hooks/useVisibilityState"
import { ADMIN_URL } from "../../routes"
import NewCustomCurriculumDialog from "../NewCustomCurriculumDialog/NewCustomCurriculumDialog"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import Typography from "../Typography/Typography"

const SetupCurriculum: FC = () => {
  const postNewCurriculum = usePostNewCurriculum()
  const newDialog = useVisibilityState()

  const handleUseMontessori = async () => {
    try {
      await postNewCurriculum.mutateAsync({ template: "montessori" })
    } catch (e) {
      Sentry.captureException(e)
    }
  }

  return (
    <Box sx={{ maxWidth: "maxWidth.sm" }} mx="auto">
      <TopBar
        breadcrumbs={[breadCrumb("Admin", ADMIN_URL), breadCrumb("Curriculum")]}
      />

      <Typography.H6 my={2} sx={{ textAlign: "center" }}>
        <Trans>Setup curriculum</Trans>
      </Typography.H6>

      <Flex p={3} sx={{ flexFlow: ["column", "row"] }}>
        <Card p={3} mr={[0, 3]} mb={[3, 0]} sx={{ width: [undefined, "50%"] }}>
          <Typography.H6 mb={2}>Montessori</Typography.H6>
          <Typography.Body mb={3}>
            <Trans>
              Start with a basic Montessori Curriculum that you can modify to
              your needs.
            </Trans>
          </Typography.Body>
          <Button variant="outline" onClick={handleUseMontessori}>
            <Trans>Use Montessori</Trans>
          </Button>
        </Card>

        <Card p={3} sx={{ width: [undefined, "50%"] }}>
          <Typography.H6 mb={2}>
            <Trans>Custom</Trans>
          </Typography.H6>
          <Typography.Body mb={3}>
            <Trans>
              Start with a blank curriculum that you can customize from scratch.
            </Trans>
          </Typography.Body>
          <Button variant="outline" onClick={newDialog.show}>
            <Trans>Use Custom</Trans>
          </Button>
        </Card>
      </Flex>

      {/* <ImportCard /> */}

      {newDialog.visible && (
        <NewCustomCurriculumDialog onDismiss={newDialog.hide} />
      )}
    </Box>
  )
}

// TODO: Curriculum import is unfinished.
// const ImportCard: FC = () => {
//   const importCurriculum = useImportCurriculum()
//   const importDialog = useVisibilityState()
//   const fileInput = useRef<HTMLInputElement>(null)
//
//   const handleImport: ChangeEventHandler<HTMLInputElement> = async (e) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       try {
//         const result = await importCurriculum.mutateAsync(file)
//         if (result?.ok) {
//           console.log("success")
//         }
//       } catch (err) {
//         Sentry.captureException(err)
//       }
//     }
//     importDialog.hide()
//   }
//
//   const handleOpenFilePicker = () => {
//     fileInput.current?.click()
//   }
//
//   return (
//     <>
//       <Card mx={3} p={3} sx={{ flexBasis: [undefined, "50%"] }}>
//         <Typography.H6 mb={2}>
//           <Trans>Import</Trans>
//         </Typography.H6>
//         <Typography.Body mb={3}>
//           <Trans>Import curriculum data from csv file that you have.</Trans>
//         </Typography.Body>
//         <Button onClick={importDialog.show}>
//           <Trans>Import</Trans>
//         </Button>
//       </Card>
//
//       {importDialog.visible && (
//         <>
//           <AlertDialog
//             title={t`Import Curriculum`}
//             body={t`This will import all data in csv file to a new curriculum, continue?`}
//             onNegativeClick={importDialog.hide}
//             onPositiveClick={handleOpenFilePicker}
//             positiveText={t`Import`}
//           />
//
//           <Box sx={{ display: "none" }}>
//             <Input
//               ref={fileInput}
//               type="file"
//               accept=".csv"
//               onChange={handleImport}
//             />
//           </Box>
//         </>
//       )}
//     </>
//   )
// }

export default SetupCurriculum
