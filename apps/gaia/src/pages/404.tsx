import Link from "next/link"
import React from "react"
import { useTrack } from "$lib/mixpanel"

const NotFound = () => {
  useTrack("404 visited")

  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:py-24 sm:px-6 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <p className="text-4xl font-extrabold text-primary-600 sm:text-5xl">
            404
          </p>
          <div className="sm:ml-6">
            <div className="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Page not found
              </h1>
              <p className="mt-1 text-base text-gray-500">
                Please check the URL in the address bar and try again.
              </p>
            </div>
            <div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              <Link href="/">
                <a className="inline-flex items-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  Go back home
                </a>
              </Link>
              <a
                href="mailto:chris@obserfy.com"
                className="inline-flex items-center rounded-md border border-transparent bg-primary-100 py-2 px-4 text-sm font-medium text-primary-700 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
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
