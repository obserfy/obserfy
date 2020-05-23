import React, { FC } from "react"
import { useQuery } from "react-query"
import Button from "./button"

const Layout: FC = ({ children }) => {
  const { data, status } = useQuery(
    "me",
    async () => {
      const result = await fetch("/api/me")

      if (result.status === 401) {
        const { error } = await result.json()
        throw Error(error)
      }

      return result.json()
    },
    {
      retry: (failureCount, error) =>
        !(error instanceof Error && error.message === "not_authenticated"),
    }
  )

  return (
    <div>
      {status === "error" && (
        <div className="absolute h-screen w-screen flex items-center justify-center bg-overlay">
          <div className="bg-background rounded shadow-md p-6">
            <h1 className="text-2xl">Looks like your session has expired</h1>
            <p className="block mt-3">Please log back in</p>
            <a href="/api/login" className="block mt-6 w-full ">
              <Button type="button" className="w-full py-3">
                Login
              </Button>
            </a>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

export default Layout
