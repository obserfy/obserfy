import { t } from "@lingui/macro"
import { useLingui } from "@lingui/react"
import { ChangeEventHandler, FC } from "react"
import { Box } from "theme-ui"
import { GuardianRelationship } from "../../hooks/api/students/usePostNewStudent"
import Select from "../Select/Select"

export interface GuardianRelationshipSelectorProps {
  value: GuardianRelationship
  onChange: ChangeEventHandler<HTMLSelectElement>
}
const GuardianRelationshipSelector: FC<GuardianRelationshipSelectorProps> = ({
  onChange,
  value,
}) => {
  const { i18n } = useLingui()

  return (
    <Box px={3} pt={3}>
      <Select label={t`Relationship`} value={value} onChange={onChange}>
        <option value={GuardianRelationship.Other}>{i18n._(t`Other`)}</option>
        <option value={GuardianRelationship.Mother}>{i18n._(t`Mother`)}</option>
        <option value={GuardianRelationship.Father}>{i18n._(t`Father`)}</option>
      </Select>
    </Box>
  )
}

export default GuardianRelationshipSelector
