import React, { FC } from "react"
import Typography from "./Typography"

export default {
  title: "Styles|Typography",
  component: Typography,
  parameters: {
    order: 1,
    componentSubtitle: "Typography components",
  },
}

export const All: FC = () => {
  return (
    <>
      <Typography.H1>Welcome Jonathan</Typography.H1>
      <Typography.H2>Wake Up</Typography.H2>
      <Typography.H3>We got a city to burn</Typography.H3>
      <Typography.H4>No Way</Typography.H4>
      <Typography.H5>Jose</Typography.H5>
      <Typography.H6>Heading 6</Typography.H6>
      <Body />
    </>
  )
}

export const H1: FC = () => <Typography.H1>Heading 1</Typography.H1>
export const H2: FC = () => <Typography.H2>Heading 2</Typography.H2>
export const H3: FC = () => <Typography.H3>Heading 3</Typography.H3>
export const H4: FC = () => <Typography.H4>Heading 4</Typography.H4>
export const H5: FC = () => <Typography.H5>Heading 5</Typography.H5>
export const H6: FC = () => <Typography.H6>Heading 6</Typography.H6>
export const Body: FC = () => (
  <Typography.Body>
    It is not politic in the commonwealth of nature to preserve virginity. Loss
    of virginity is rational increase, and there was never virgin got till
    virginity was first lost. That you were made of is metal to make virgins.
    Virginity by being once lost may be ten times found; by being ever kept is
    ever lost. Tis too cold a companion.
  </Typography.Body>
)
