import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React, { FC } from "react"
import { Trans } from "@lingui/macro"
import Button from "./Button/Button"
import Logo from "../images/logo-standalone.svg"

const Header: FC = () => (
  <header
    style={{ marginBottom: `1.45rem` }}
    className="max-w-lg p-3 flex flex-row items-center max-w-7xl mx-auto relative"
  >
    <div className="flex items-center">
      <img src={Logo} className="w-8" alt="logo" />
      <h1 className="text-xl ml-2 font-bold font-body">
        <Link to="/">Obserfy</Link>
      </h1>
    </div>

    <nav className="invisible md:visible flex mx-auto absolute w-full left-0 right-0 justify-center">
      <NavLinks href="https://feedback.obserfy.com">Roadmap</NavLinks>
      <NavLinks href="https://feedback.obserfy.com/changelog">
        What&apos;s New
      </NavLinks>
      <InternalNavLinks href="/docs">Documentation</InternalNavLinks>
      <InternalNavLinks href="/blogs">Blog</InternalNavLinks>
    </nav>

    <div className="flex items-center ml-auto">
      <a href="https://app.obserfy.com" className="">
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

const NavLinks: FC<{ href: string }> = ({ href, children }) => (
  <a
    href={href}
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-3"
  >
    <Trans>{children}</Trans>
  </a>
)

const InternalNavLinks: FC<{ href: string }> = ({ href, children }) => (
  <a
    href={href}
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-3"
  >
    <Trans>{children}</Trans>
  </a>
)

export default Header
