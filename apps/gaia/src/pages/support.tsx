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
    if (user) {
      loadCanny()
      Canny("identify", {
        appID: "5f0d32f03899af5d46779764",
        user: {
          // Replace these values with the current user's datapac
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
  }, [])
  return (
    <>
      <Head>
        <title>Support | Obserfy for Parents</title>
      </Head>
      <div className="max-w-3xl mx-auto mt-2 flex flex-col items-center">
        <div className="w-full rounded-lg p-2 bg-white border border-gray-300 mb-2">
          <a href="https://feedback.obserfy.com">
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <div className="text-gray-900 font-bold text-xl">
                  Go To Canny?
                </div>
                <p className="text-gray-700 text-base">
                  Post and upvote suggestions, ideas, and issues.
                </p>
              </div>
              <div>
                <Img
                  className="my-auto h-full ml-auto"
                  alt="logout icon"
                  src={LogoutIcon}
                  width={25}
                />
              </div>
            </div>
          </a>
        </div>
        <div className="w-full rounded-lg p-2 bg-white border border-gray-300">
          <a href="mailto:chrsep@protonmail.com">
            <div className="grid grid-cols-3">
              <div className="col-span-2">
                <div className="text-gray-900 font-bold text-xl mb-2">
                  Email Us
                </div>
                <p className="text-gray-700 text-base">
                  Have a question? Shoot us an email at chrsep@protonmail.com
                </p>
              </div>
              <div>
                <Img
                  className="my-auto h-full ml-auto"
                  alt="logout icon"
                  src={LogoutIcon}
                  width={25}
                />
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  )
}

export default SupportPage
