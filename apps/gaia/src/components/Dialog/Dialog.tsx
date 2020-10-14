import React, { FC } from "react"

const Dialog: FC = ({ children }) => {
  return (
    <div className="fixed h-screen w-screen bg-overlay z-50 top-0 left-0 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-md p-3 flex flex-col items-center">
        {children}
      </div>
    </div>
  )
}

export default Dialog
