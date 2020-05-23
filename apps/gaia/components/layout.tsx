import React, { FC } from "react"
import { useQuery } from "react-query"

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
        <div className="dialog-overlay">
          <div className="dialog p-6">
            <h1>Looks like your session has expired</h1>
            <p className="block mt-3">Please log back in</p>
            <a href="/api/login" className="block mt-6 w-full ">
              <button type="button" className="w-full py-3">
                Login
              </button>
            </a>
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

export default Layout
