import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React, { FC, useState } from "react"
import { t, Trans } from "@lingui/macro"
import Button from "./Button/Button"
import Logo from "../images/logo-standalone.svg"
import MenuIcon from "../icons/menu.svg"
import CloseIcon from "../icons/close.svg"

const Header: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  return (
    <>
      <header
        className="
      blurred-bg
      mb-8
      max-w-7xl p-3 mx-auto
      flex flex-row items-center
      sticky top-0 bg-white bg-opacity-95 border-b
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
          <InternalNavLinks href="/blogs" text={t`Pricing`} />
          <NavLinks href="https://feedback.obserfy.com" text={t`Roadmap`} />
          <NavLinks
            href="https://feedback.obserfy.com/changelog"
            text={t`What's New`}
          />
          <InternalNavLinks href="/docs" text={t`Docs`} />
          <InternalNavLinks href="/blogs" text={t`Blog`} />
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
        <Button
          secondary
          className="px-3 py-2 text-sm border md:hidden"
          onClick={() => setShowSidebar(true)}
        >
          <img alt="open menu" src={MenuIcon} />
        </Button>
      </header>
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  )
}

const NavLinks: FC<{ href: string; text: string }> = ({ href, text }) => (
  <a
    href={href}
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-2 lg:p-3 pointer-events-auto"
  >
    <Trans id={text} />
  </a>
)

const InternalNavLinks: FC<{ href: string; text: string }> = ({
  href,
  text,
}) => (
  <Link
    to={href}
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-2 lg:p-3 pointer-events-auto"
  >
    <Trans id={text} />
  </Link>
)

const Sidebar: FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  return (
    <div
      className={`fixed shadow w-4/5 h-full right-0 ${
        show ? "" : "-right-full"
      } top-0 bottom-0 bg-white z-50 transition-all duration-500 ease-in-out md:hidden border-l`}
    >
      <div className="flex m-2 mb-8">
        <Button secondary className="flex-shrink-0 mx-1 px-3" onClick={onClose}>
          <img alt="open menu" src={CloseIcon} />
        </Button>
        <a href="https://parent.obserfy.com" className="w-full mx-1">
          <Button secondary className="w-full">
            Parent
          </Button>
        </a>
        <a href="https://app.obserfy.com" className="w-full mx-1">
          <Button secondary className="w-full">
            Teacher
          </Button>
        </a>
      </div>
      <div className="prose flex flex-col ml-6">
        <h2>
          <Link
            to="/pricing"
            className="no-underline font-bold hover:text-green-700 transition-colors"
          >
            Pricing
          </Link>
        </h2>
        <h2>
          <a
            href="https://feedback.obserfy.com"
            className="no-underline font-bold hover:text-green-700 transition-colors"
          >
            Roadmap
          </a>
        </h2>
        <h2>
          <a
            href="https://feedback.obserfy.com/changelog"
            className="no-underline font-bold hover:text-green-700 transition-colors"
          >
            What&apos;s New
          </a>
        </h2>
        <h2>
          <Link
            to="/docs"
            className="no-underline font-bold hover:text-green-700 transition-colors"
          >
            Documentation
          </Link>
        </h2>
        <h2>
          <Link
            to="/blog"
            className="no-underline font-bold hover:text-green-700 transition-colors"
          >
            Blog
          </Link>
        </h2>
      </div>
    </div>
  )
}

export default Header
