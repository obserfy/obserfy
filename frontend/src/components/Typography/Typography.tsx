import React, { FC } from "react"
import { Heading, Text, TextProps as BaseTextProps } from "rebass"

export type TextProps = Omit<BaseTextProps, "css">
// TODO: Do not edit, apparently this pattern doesn't work well
//  autocomplete doesn't work correctly with this component.
//  We'll rebuild typographic components into it's own components
//  from now on, eg. components such as Label and Subtitle.
interface Typography {
  H1: FC<TextProps>
  H2: FC<TextProps>
  H3: FC<TextProps>
  H4: FC<TextProps>
  H5: FC<TextProps>
  H6: FC<TextProps>
  Body: FC<TextProps>
}

/**
 * We group all the typography components here so that we can replace all their
 * instances at once easily through the Typography component.
 */
export const Typography: Typography = {
  H1: props => <Heading color="text" as="h1" variant="h1" {...props} />,
  H2: props => <Heading color="text" as="h2" variant="h2" {...props} />,
  H3: props => <Heading color="text" as="h3" variant="h3" {...props} />,
  H4: props => <Heading color="text" as="h4" variant="h4" {...props} />,
  H5: props => <Heading color="text" as="h5" variant="h5" {...props} />,
  H6: props => <Heading color="text" as="h6" variant="h6" {...props} />,
  Body: props => (
    <Text color="text" fontSize={[2, 1]} as="p" variant="body" {...props} />
  ),
}

export default Typography
