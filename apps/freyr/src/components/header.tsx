import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React, { FC } from "react"
import { Trans } from "@lingui/macro"
import Button from "./button"
import Logo from "../images/logo-standalone.svg"

const Header: FC = () => {
  return (
    <header
      style={{ marginBottom: `1.45rem` }}
      className="max-w-lg p-3 flex flex-row items-center max-w-6xl mx-auto"
    >
      <div className="flex items-center mr-auto">
        <img src={Logo} className="w-8" alt="logo" />
        <h1 className="text-xl ml-2 font-bold font-body">
          <Link to="/">Obserfy</Link>
        </h1>
      </div>
      <div className="flex items-center">
        <a href="https://app.obserfy.com/" className="">
          <Button secondary className="px-3 py-2 mr-3 text-sm">
            <Trans>Teachers</Trans>
          </Button>
        </a>

        <a href="https://parent.obserfy.com/api/login">
          <Button secondary className="px-3 py-2 text-sm border">
            <Trans>Parents</Trans>
          </Button>
        </a>
      </div>
    </header>
  )
}

export default Header
