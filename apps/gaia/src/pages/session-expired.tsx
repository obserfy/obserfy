import React from "react"
import Button from "../components/Button/Button"

const SessionExpired = () => (
  <div className="max-w-lg mx-auto my-8">
    <h1 className="text-xl m-3 leading-tight font-bold inline-block">
      Looks like your session has expired
    </h1>
    <a href="/api/login" className="block mt-6 w-full px-3">
      <Button type="button" className="w-full">
        Login
      </Button>
    </a>
  </div>
)

export default SessionExpired
