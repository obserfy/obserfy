// eslint-disable-next-line no-restricted-imports
import dayjs, { Dayjs } from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import duration from "dayjs/plugin/duration"
import customParseFormat from "dayjs/plugin/customParseFormat"
import localeData from "dayjs/plugin/localeData"

dayjs.extend(relativeTime)
dayjs.extend(duration)
dayjs.extend(customParseFormat)
dayjs.extend(localeData)

export default dayjs
export { Dayjs }
