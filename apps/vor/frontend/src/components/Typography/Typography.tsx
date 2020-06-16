import React, { FC, PropsWithoutRef } from "react"
import { Heading, Text, BoxProps, HeadingProps } from "theme-ui"

interface Typography {
  H1: FC<HeadingProps>
  H2: FC<HeadingProps>
  H3: FC<HeadingProps>
  H4: FC<HeadingProps>
  H5: FC<HeadingProps>
  H6: FC<HeadingProps>
  Body: FC<PropsWithoutRef<BoxProps>>
}

/**
 * We group all the typography components here so that we can replace all their
 * instances at once easily through the Typography component.
 */
export const Typography: Typography = {
  H1: (props) => <Heading color="text" as="h1" variant="h1" {...props} />,
  H2: (props) => <Heading color="text" as="h2" variant="h2" {...props} />,
  H3: (props) => <Heading color="text" as="h3" variant="h3" {...props} />,
  H4: (props) => <Heading color="text" as="h4" variant="h4" {...props} />,
  H5: (props) => <Heading color="text" as="h5" variant="h5" {...props} />,
  H6: (props) => <Heading color="text" as="h6" variant="h6" {...props} />,
  Body: ({ ...props }) => (
    <Text variant="body" color="text" as="p" {...props} />
  ),
}

export default Typography
