import React, { ChangeEventHandler, FC } from "react"
import { InputProps } from "theme-ui"
import { ReactComponent as SearchIcon } from "../../icons/search.svg"
import Input from "../Input/Input"

interface Props extends InputProps {
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export const SearchBar: FC<Props> = ({ sx, ...props }) => (
  <Input
    name="name"
    placeholder="Search"
    icon={SearchIcon}
    backgroundColor="surface"
    sx={{ ...sx, width: "100%" }}
    {...props}
  />
)

export default SearchBar
