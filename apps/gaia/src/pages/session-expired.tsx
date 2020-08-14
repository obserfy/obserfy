import React from "react"
import Button from "../components/Button/Button"

const SessionExpired = () => (
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
)

export default SessionExpired
