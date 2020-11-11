import React, { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import useGetUser from "../hooks/api/useGetUser"
import useGetChildren from "../hooks/api/useGetChildren"

const NoData = () => {
  const children = useGetChildren()
  const { data: user } = useGetUser()
  const router = useRouter()

  useEffect(() => {
    // throw user to root page when they have data
    if ((children.data?.length ?? 0) > 0) {
      const newId = children.data?.[0]?.id
      const redirectUrl = `/?childId=${newId}`
      router.replace(redirectUrl)
    }
  }, [children.data])

  return (
    <div className="max-w-3xl mx-auto">
      <div className="h-full prose prose-sm max-w-lg p-3 pt-8">
        <Image src="/undraw_void_3ggu.svg" width={180} height={180} />
        <h1>We can&apos;t seem to find your data yet</h1>
        <p>
          Make sure that you are logging in with the email that you gave to your
          school.
        </p>
        <p>
          If your email is correct, try verifying with your school and see
          whether you and your email has been set as one of the guardian for
          your child.
        </p>
        <p>
          Email you are using now is: <b>{user?.email}</b>
        </p>
      </div>
    </div>
  )
}

export default NoData
