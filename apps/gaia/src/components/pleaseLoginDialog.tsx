import React from "react"
import Button from "./button"

const PleaseLoginDialog = () => (
  <div className="fixed h-screen w-screen flex items-center justify-center bg-overlay z-50 px-3">
    <div className="bg-surface rounded shadow-md p-6">
      <h1 className="text-2xl">Looks like your session has expired</h1>
      <p className="block mt-3">Please log back in</p>
      <a href="/api/login" className="block mt-6 w-full ">
        <Button type="button" className="w-full py-3">
          Login
        </Button>
      </a>
    </div>
  </div>
)

export default PleaseLoginDialog
