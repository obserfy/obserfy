import React, { ChangeEventHandler, FC } from "react"
import { InputProps } from "theme-ui"
import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { ReactComponent as SearchIcon } from "../../icons/search.svg"
import Input from "../Input/Input"

interface Props extends Omit<InputProps, "ref"> {
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export const SearchBar: FC<Props> = ({ sx, ...props }) => {
  const { i18n } = useLingui()

  return (
    <Input
      small
      name="name"
      placeholder={i18n._(t`Search`)}
      icon={SearchIcon}
      backgroundColor="surface"
      sx={{ ...sx, width: "100%" }}
      {...props}
    />
  )
}

export default SearchBar
