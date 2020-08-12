import React, { FC, useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
import Img from "react-optimized-image"
import useGetUser from "../hooks/api/useGetUser"
import Header from "./header"
import useGetChildren from "../hooks/api/useGetChildren"
import Button from "./button"
import StudentPicPlaceholder from "../images/student_pic_placeholder.jpg"
import useGetChild from "../hooks/api/useGetChild"
import { useQueryString } from "../hooks/useQueryString"
import Logo from "../images/logo.svg"

const Layout: FC = ({ children }) => {
  const childId = useQueryString("childId")

  const user = useGetUser()
  const userChildren = useGetChildren()
  const child = useGetChild(childId)
  const router = useRouter()

  useEffect(() => {
    const newId = userChildren.data?.[0]?.id
    if (!router.query.childId && newId) {
      router.push(`/?childId=${userChildren.data?.[0]?.id}`)
    }
  }, [userChildren.data])

  if (user.error?.message === "not_authenticated") {
    return <ExpiredSession />
  }

  return (
    <div className="bg-background">
      {user.status === "success" ? (
        <Header userName={user.data?.name} userImageSrc={user.data?.picture} />
      ) : (
        <div className="bg-white">
          <PlaceholderHeader />
        </div>
      )}
      {user.status === "success" && child.status === "success" ? (
        <>
          <div className="bg-white">
            <div className="flex px-3 py-3 max-w-3xl mx-auto">
              <div>
                {child.data?.profilePic ? (
                  <img
                    alt="profile"
                    src={child.data.profilePic}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                ) : (
                  <Img
                    alt="profile"
                    src={StudentPicPlaceholder}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="ml-4">
                <div className="text-2xl leading-tight">{child.data?.name}</div>
                <div className="text-sm text-gray-700">
                  {child.data?.schoolName}
                </div>
              </div>
            </div>
          </div>
          <div className="sticky top-0 bg-surface border-b ">
            <nav className="w-full flex max-w-3xl mx-auto">
              <div
                className="mx-3 py-2 border-b-2 border-black text-sm"
                style={{ marginBottom: "-1px" }}
              >
                Lesson Plans
              </div>
            </nav>
          </div>
          <main className="max-w-3xl mx-auto">{children}</main>
        </>
      ) : (
        <LoadingPlaceholder />
      )}
    </div>
  )
}

const PlaceholderHeader = () => {
  return (
    <div className="p-3 pb-2 flex items-center max-w-3xl  mx-auto bg-white">
      <div className="flex items-center">
        <Img
          alt="obserfy logo"
          src={Logo}
          height={30}
          width={30}
          className="ml-3"
        />
        <h1 className="ml-2 text-lg font-bold">Obserfy</h1>
      </div>
    </div>
  )
}

const LoadingPlaceholder = () => {
  return (
    <div className="bg-white">
      <div className="bg-white flex px-3 py-6 max-w-3xl mx-auto">
        <div>
          <div
            className="rounded-full loading-placeholder"
            style={{
              width: 60,
              height: 60,
            }}
          />{" "}
        </div>
        <div>
          <div className="loading-placeholder ml-3 text-2xl leading-tight my-2 w-32 h-6 rounded" />
          <div className="loading-placeholder ml-3 text-sm text-gray-700 my-2 w-24 h-4 rounded" />
        </div>
      </div>
      <div className="sticky top-0 bg-surface border-b ">
        <nav className="w-full flex max-w-3xl mx-auto">
          <div className="mx-3 px-1 py-2 border-b-2 text-sm ">
            <div className="loading-placeholder w-24 rounded h-4" />
          </div>
        </nav>
      </div>
    </div>
  )
}

const ExpiredSession = () => {
  return (
    <div>
      <Head>
        <html lang="en" />
        <title>Obserfy for Parents</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PlaceholderHeader />
      <main className="max-w-lg mx-auto my-8">
        <h1 className="text-2xl m-3 leading-tight">
          Looks like your session has expired
        </h1>
        <a href="/api/login" className="block mt-6 w-full px-3">
          <Button type="button" className="w-full py-3">
            Login
          </Button>
        </a>
      </main>
    </div>
  )
}

export default Layout
