import React, { ChangeEventHandler, FC } from "react"
import { InputProps } from "theme-ui"
import { i18nMark } from "@lingui/core"
import { ReactComponent as SearchIcon } from "../../icons/search.svg"
import Input from "../Input/Input"

interface Props extends InputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export const SearchBar: FC<Props> = ({ sx, ...props }) => (
  <Input
    small
    name="name"
    placeholder={i18nMark("Search")}
    icon={SearchIcon}
    backgroundColor="surface"
    sx={{ ...sx, width: "100%" }}
    {...props}
  />
)

export default SearchBar
