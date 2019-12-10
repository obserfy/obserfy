import { useIntl } from "gatsby-plugin-intl3"
import en from "./en.json"

export function useFormatMessage(
  id: keyof typeof en,
  values?: Record<string, string | number | boolean | null | undefined | Date>
): string {
  const intl = useIntl()
  return intl.formatMessage({ id }, values)
}
