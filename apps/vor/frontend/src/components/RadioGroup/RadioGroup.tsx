import { FC } from "react"
import { Box, Radio, Text } from "theme-ui"
import { borderBottom, borderFull } from "../../border"

interface Options {
  label: string
  description: string
}

export interface RadioGroupsProps {
  name: string
  options: Options[]
  value: number
  onChange: (value: number) => void
  className?: string
}

const RadioGroup: FC<RadioGroupsProps> = ({
  options,
  name,
  className,
  value = 0,
  onChange,
}) => (
  <Box mx={3} className={className}>
    <Text
      mb={2}
      color="textMediumEmphasis"
      sx={{ display: "block", fontWeight: "bold" }}
    >
      {name}
    </Text>
    <Box
      sx={{
        ...borderFull,
        borderRadius: "default",
        backgroundColor: "surface",
      }}
    >
      {options.map(({ label, description }, idx) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
        <label
          key={label}
          htmlFor={label}
          sx={{
            ...borderBottom,
            borderStyle: idx !== options.length - 1 ? "solid" : "none",
            display: "flex",
            alignItems: "start",
            p: 3,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "primaryLightest",
            },
          }}
          onClick={() => onChange(idx)}
        >
          <Radio
            type="radio"
            name={name}
            value={idx}
            sx={{ mr: 3 }}
            checked={value === idx}
          />

          <Box>
            <Box>
              <Text sx={{ fontWeight: "bold" }}>{label}</Text>
            </Box>
            <Box>
              <Text color="textMediumEmphasis">{description}</Text>
            </Box>
          </Box>
        </label>
      ))}
    </Box>
  </Box>
)

export default RadioGroup
