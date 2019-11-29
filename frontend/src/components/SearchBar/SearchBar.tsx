import React, { ChangeEventHandler, FC } from "react"
import { ReactComponent as SearchIcon } from "../../icons/search.svg"
import Input from "../Input/Input"
import { BoxProps } from "../Box/Box"

interface Props extends BoxProps {
  onChange?: ChangeEventHandler<HTMLInputElement>
}
export const SearchBar: FC<Props> = props => (
  <Input
    name="name"
    width="100%"
    placeholder="Search"
    icon={SearchIcon}
    backgroundColor="surface"
    {...props}
  />
)

export default SearchBar
