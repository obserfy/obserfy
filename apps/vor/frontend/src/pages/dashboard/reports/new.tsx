import { t } from "@lingui/macro"
import PageNewReport from "../../../components/PageNewReport/PageNewReport"
import SEO from "../../../components/seo"

const NewReport = () => (
  <>
    <SEO title={t`New Report`} />
    <PageNewReport />
  </>
)

export default NewReport
