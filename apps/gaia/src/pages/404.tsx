import React, { useEffect } from "react"
import Link from "next/link"

const NotFound = () => {
  useEffect(() => {
    if (mixpanel.track) {
      mixpanel.track("404 visited")
    }
  }, [])

  return (
    <div className="md:grid md:place-items-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 min-h-screen bg-white">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl sm:text-5xl font-extrabold text-primary-600">
            404
          </p>
          <div className="sm:ml-6">
            <div className="sm:pl-6 sm:border-l sm:border-gray-200">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                Page not found
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="flex sm:pl-6 mt-10 space-x-3 sm:border-l sm:border-transparent">
              <Link href="/">
                <a className="inline-flex items-center py-2 px-4 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md border border-transparent focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm focus:outline-none">
                  Go back home
                </a>
              </Link>
              <a
                href="mailto:chris@obserfy.com"
                className="inline-flex items-center py-2 px-4 text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 rounded-md border border-transparent focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
              >
                Contact support
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default NotFound
