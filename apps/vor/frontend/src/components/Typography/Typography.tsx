import React, { FC, PropsWithoutRef } from "react"
import { Heading, HeadingProps, Text, TextProps } from "theme-ui"

/**
 * We group all the typography components here so that we can replace all their
 * instances at once easily through the Typography component.
 */
export const Typography: {
  H1: FC<HeadingProps>
  H2: FC<HeadingProps>
  H3: FC<HeadingProps>
  H4: FC<HeadingProps>
  H5: FC<HeadingProps>
  H6: FC<HeadingProps>
  Body: FC<PropsWithoutRef<TextProps>>
} = {
  H1: (props) => <Heading as="h1" variant="h1" {...props} />,
  H2: (props) => <Heading as="h2" variant="h2" {...props} />,
  H3: (props) => <Heading as="h3" variant="h3" {...props} />,
  H4: (props) => <Heading as="h4" variant="h4" {...props} />,
  H5: (props) => <Heading as="h5" variant="h5" {...props} />,
  H6: (props) => <Heading as="h6" variant="h6" {...props} />,
  Body: (props) => <Text variant="body" as="p" {...props} />,
}

export default Typography
