import React from "react"
import Logo from "../images/logo-standalone.svg"
import { Link } from "./Link"

const DocsLogo = () => (
  <div className="flex items-center">
    <Link to="/" className="flex items-center hover:underline">
      <img src={Logo} className="w-6" alt="logo" />
      <p className="text-lg ml-2 font-bold font-body">Obserfy</p>
    </Link>
    <h1 className="text-lg ml-2 font-bold font-body">/</h1>
    <Link to="/docs" className="flex items-center hover:underline">
      <p className="text-lg ml-2 font-body">Docs</p>
    </Link>
  </div>
)

export default DocsLogo
