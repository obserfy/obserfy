import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React, { FC } from "react"
import { Trans } from "@lingui/macro"
import Button from "./Button/Button"
import Logo from "../images/logo-standalone.svg"
import MenuIcon from "../icons/menu.svg"

const Header: FC = () => (
  <header
    className="
    blurred-bg
    mb-8
    max-w-7xl p-3 mx-auto
    flex flex-row items-center
    sticky top-0 bg-white bg-opacity-80 border-b
    md:relative md:bg-transparent md:border-none
    z-10
    "
  >
    <div className="flex items-center ml-1">
      <img src={Logo} className="w-8" alt="logo" />
      <h1 className="text-xl ml-2 font-bold font-body">
        <Link to="/">Obserfy</Link>
      </h1>
    </div>

    <nav className="hidden md:flex mx-auto absolute w-full left-0 right-0 justify-center pointer-events-none">
      <InternalNavLinks href="/blogs">Pricing</InternalNavLinks>
      <NavLinks href="https://feedback.obserfy.com">Roadmap</NavLinks>
      <NavLinks href="https://feedback.obserfy.com/changelog">
        What&apos;s New
      </NavLinks>
      <InternalNavLinks href="/docs">Docs</InternalNavLinks>
      <InternalNavLinks href="/blogs">Blog</InternalNavLinks>
    </nav>

    <div className="hidden md:flex items-center ml-auto">
      <a href="https://app.obserfy.com" className="ml-2">
        <Button secondary className="px-3 py-2 text-sm">
          <Trans>Teachers</Trans>
        </Button>
      </a>

      <a href="https://parent.obserfy.com/api/login" className="ml-2">
        <Button secondary className="px-3 py-2 text-sm border">
          <Trans>Parents</Trans>
        </Button>
      </a>
    </div>

    <div className="ml-auto mr-4 font-bold text-green-700 md:hidden">
      Sign In
    </div>
    <Button secondary className="px-3 py-2 text-sm border md:hidden">
      <img alt="open menu" src={MenuIcon} />
    </Button>
  </header>
)

const NavLinks: FC<{ href: string }> = ({ href, children }) => (
  <a
    href={href}
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-2 lg:p-3 pointer-events-auto"
  >
    <Trans>{children}</Trans>
  </a>
)

const InternalNavLinks: FC<{ href: string }> = ({ href, children }) => (
  <a
    href={href}
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-2 lg:p-3 pointer-events-auto"
  >
    <Trans>{children}</Trans>
  </a>
)

export default Header
