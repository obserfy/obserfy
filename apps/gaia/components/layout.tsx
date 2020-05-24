import React, { FC, useEffect } from "react"
import { useRouter } from "next/router"
import useGetUser from "../hooks/useGetUser"
import PleaseLoginDialog from "./pleaseLoginDialog"
import Header from "./header"
import useGetChildren from "../hooks/useGetChildren"

const Layout: FC = ({ children }) => {
  const { data, status } = useGetUser()
  const userChildren = useGetChildren()
  const router = useRouter()

  useEffect(() => {
    const newId = userChildren.data?.[0]?.id
    if (router.query.child === undefined && newId !== undefined) {
      router.push(`/?child=${userChildren.data?.[0]?.id}`)
    }
  }, [userChildren.data])

  return (
    <>
      {status === "error" && <PleaseLoginDialog />}
      <div className="bg-background">
        <Header userName={data?.name} userImageSrc={data?.picture} />
        <main className="max-w-6xl mx-auto">{children}</main>
      </div>
    </>
  )
}

export default Layout
