import React from "react"

const Navbar = () => {
  return (
    <div className="sticky top-0 bg-surface border-b">
      <nav className="w-full flex max-w-3xl mx-auto pt-3">
        <div
          className="mx-3 py-1 border-b-2 border-black text-sm px-2"
          style={{ marginBottom: "-1px" }}
        >
          Lesson Plans
        </div>
      </nav>
    </div>
  )
}

export default Navbar
