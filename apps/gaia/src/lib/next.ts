import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"

export type SSR<P> = NextPage<InferGetServerSidePropsType<P>>

export const getStudentId = (ctx: GetServerSidePropsContext) => {
  const { studentId } = ctx.query

  if (typeof studentId === "string") {
    return studentId
  }

  throw new Error("no student id")
}
