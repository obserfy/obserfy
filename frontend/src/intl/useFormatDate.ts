import {
  FormatDateOptions,
  FormatRelativeTimeOptions,
  useIntl,
} from "gatsby-plugin-intl3"
import IntlRelativeTimeFormat from "@formatjs/intl-relativetimeformat"

export function useFormatDate(
  value: Parameters<Intl.DateTimeFormat["format"]>[0] | string,
  opts?: FormatDateOptions
): string {
  const intl = useIntl()
  return intl.formatDate(value, opts)
}

export function useFormatRelativeTime(
  value: Parameters<IntlRelativeTimeFormat["format"]>[0],
  unit?: Parameters<IntlRelativeTimeFormat["format"]>[1],
  opts?: FormatRelativeTimeOptions
): string {
  const intl = useIntl()
  return intl.formatRelativeTime(value, unit, opts)
}
