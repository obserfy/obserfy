import React, { FC } from "react"
import useGetUser from "../apiHooks/useGetUser"
import PleaseLoginDialog from "./pleaseLoginDialog"
import Header from "./header"

const Layout: FC = ({ children }) => {
  const { data, status } = useGetUser()

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
