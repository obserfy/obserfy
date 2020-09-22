import React, { useEffect } from "react"
import Head from "next/head"
import Img from "react-optimized-image"
import { useQueryString } from "../hooks/useQueryString"
import LogoutIcon from "../icons/log-out.svg"
import loadCanny from "../utils/canny"
import useGetUser from "../hooks/api/useGetUser"
import useGetChild from "../hooks/api/useGetChild"

const SupportPage = () => {
  const childId = useQueryString("childId")
  const child = useGetChild(childId)
  const user = useGetUser()

  useEffect(() => {
    if (user.isSuccess && child.isSuccess) {
      loadCanny()
      Canny("identify", {
        appID: "5f0d32f03899af5d46779764",
        user: {
          email: user.data?.name,
          name: user.data?.name,
          id: user.data?.sub,
          companies: [
            {
              name: child.data?.schoolName,
              id: child.data?.schoolId,
            },
          ],
        },
      })
    }
  }, [user.data, child.data])

  return (
    <>
      <Head>
        <title>Support | Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto mt-2 flex flex-col items-center">
        <div className="w-full md:rounded p-3 bg-white border border-gray-300 mb-2">
          <a href="https://feedback.obserfy.com/parent-dashboard">
            <div className="flex">
              <div>
                <h6 className="text-gray-900 font-bold text-sm mb-2">
                  Post feedback
                </h6>
                <p className="text-gray-700 text-sm">
                  Tell us how to improve obserfy for parents
                </p>
              </div>
              <Img
                className="my-auto h-full ml-auto m-3"
                alt="logout icon"
                src={LogoutIcon}
                width={18}
              />
            </div>
          </a>
        </div>
        <div className="w-full md:rounded p-3 bg-white border border-gray-300">
          <a href="mailto:support@obserfy.com">
            <div className="flex">
              <div>
                <h6 className="text-gray-900 font-bold text-sm mb-2">
                  Email Us
                </h6>
                <p className="text-gray-700 text-sm">
                  Have a question? Shoot us an email at support@obserfy.com
                </p>
              </div>
              <Img
                className="my-auto h-full ml-auto m-3"
                alt="logout icon"
                src={LogoutIcon}
                width={18}
              />
            </div>
          </a>
        </div>
      </div>
    </>
  )
}

export default SupportPage
