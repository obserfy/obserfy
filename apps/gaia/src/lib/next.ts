import { InferGetServerSidePropsType, NextPage } from "next"

export type SSR<P> = NextPage<InferGetServerSidePropsType<P>>
