import {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next"

export type SSR<P extends (args: any) => any> = NextPage<
  InferGetServerSidePropsType<P>
>

export const getStudentId = (ctx: GetServerSidePropsContext) => {
  const { studentId } = ctx.query

  if (typeof studentId === "string") {
    return studentId
  }

  throw new Error("no student id")
}

export const getQueryString = (ctx: GetServerSidePropsContext, key: string) => {
  const value = ctx.query[key]

  if (typeof value === "string" && value !== "") {
    return value
  }

  return undefined
}

type SearchParam<Q extends string> = Q extends ""
  ? {}
  : { searchParams: Record<Q, string> }

type Params<P extends string> = P extends ""
  ? {}
  : { params: Record<P, string> }

export type PageProps<
  P extends string = "",
  Q extends string = ""
> = Params<P> & SearchParam<Q>
