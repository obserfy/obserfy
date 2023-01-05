import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useGetChildren from "../hooks/api/useGetChildren"
import useGetUser from "../hooks/api/useGetUser"

const NoData = () => {
  const children = useGetChildren()
  const { data: user } = useGetUser()
  const router = useRouter()

  useEffect(() => {
    // throw user to root page when they have data
    if ((children.data?.length ?? 0) > 0) {
      const newId = children.data?.[0]?.id
      router.replace(`/${newId}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children.data])

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <div className="prose h-full max-w-lg p-3 pt-8">
          <Image
            src="/undraw_void_3ggu.svg"
            width={180}
            height={180}
            alt={"Not found"}
          />
          <h1>We can&apos;t seem to find your data yet</h1>
          <p>
            Make sure that you are logging in with the email that you gave to
            your school.
          </p>
          <p>
            If your email is correct, try asking your school and see whether
            your email has been set as one of the guardian for your child.
          </p>
          <p>
            Email you are using now is: <b>{user?.email}</b>
          </p>

          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/api/auth/logout">Sign Out</a>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = withPageAuthRequired()

export default NoData
