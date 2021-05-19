import React, { FC, useState } from "react"
import { t, Trans } from "@lingui/macro"
import Button from "./Button/Button"
import Logo from "../images/logo-standalone.svg"
import MenuIcon from "../icons/menu.svg"
import CloseIcon from "../icons/close.svg"
import { Link } from "./Link"

const Header: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSignInButton, setShowSignInButton] = useState(false)
  return (
    <>
      <header
        className="
        backdrop-blur md:backdrop-none
        mb-8
        max-w-7xl p-3 mx-auto
        sticky top-0
        md:relative md:bg-transparent md:border-none
        z-10
      "
      >
        <div className="flex flex-row items-center ">
          <div className="flex items-center ml-1">
            <Link to="/" className="flex items-center">
              <img src={Logo} className="w-8" alt="logo" />
              <p className="text-xl ml-2 font-bold font-body">Obserfy</p>
            </Link>
          </div>

          <nav className="hidden md:flex ml-3 lg:mx-auto lg:absolute lg:w-full left-0 right-0 justify-center pointer-events-none">
            <InternalNavLinks href="/docs" text={t`Docs`} />
            <InternalNavLinks href="/pricing" text={t`Pricing`} />
            <NavLinks href="https://feedback.obserfy.com" text={t`Roadmap`} />
            <NavLinks
              href="https://feedback.obserfy.com/changelog"
              text={t`What's New`}
            />
            {/* <InternalNavLinks href="/blogs" text={t`Blog`} /> */}
            {/* <InternalNavLinks href="/contact" text={t`Contact Us`} /> */}
          </nav>

          <div className="hidden md:flex items-center ml-auto">
            <a href="https://parent.obserfy.com/api/auth/login">
              <Button secondary className="px-3 py-2 text-xs border">
                <Trans>Sign In for Parents</Trans>
              </Button>
            </a>
            <a href="https://app.obserfy.com" className="ml-2">
              <Button secondary className="px-3 py-2 text-xs text-green-700">
                <Trans>Sign In for Teachers</Trans>
              </Button>
            </a>
          </div>

          <button
            className={`ml-auto mr-4 font-bold text-green-700 md:hidden p-2 ${
              showSignInButton ? "border-b-2 border-green-700" : ""
            }`}
            onClick={() => setShowSignInButton(!showSignInButton)}
          >
            Sign In
          </button>
          <Button
            secondary
            className="px-3 py-2 text-sm border md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <img alt="open menu" src={MenuIcon} />
          </Button>
        </div>
        {showSignInButton && (
          <div className="flex mt-3 md:hidden">
            <a href="https://parent.obserfy.com" className="w-full mr-3 block">
              <Button secondary className="w-full text-sm">
                <Trans>For Parents</Trans>
              </Button>
            </a>
            <a href="https://app.obserfy.com" className="w-full block">
              <Button secondary className="text-green-700 w-full text-sm">
                <Trans>For Teachers</Trans>
              </Button>
            </a>
          </div>
        )}
      </header>
      <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  )
}

const NavLinks: FC<{ href: string; text: string }> = ({ href, text }) => (
  <a
    href={href}
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-2 lg:p-3 pointer-events-auto font-body whitespace-nowrap"
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
    className="hover:text-green-700 transition-colors duration-200 ease-in-out p-2 lg:p-3 pointer-events-auto font-body"
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
      } top-0 bottom-0 bg-white z-50 transition-all duration-200 ease-in-out md:hidden border-l`}
    >
      <div className="m-2 mb-8 items-start">
        <div className="flex items-center">
          <div className="prose pl-6 opacity-60">
            <h2 className="m-0">
              <Trans>Links</Trans>
            </h2>
          </div>
          <Button
            secondary
            className="flex-shrink-0 mx-1 px-3 ml-auto"
            onClick={onClose}
          >
            <img alt="open menu" src={CloseIcon} />
          </Button>
        </div>
        <div className="prose flex flex-col ml-6">
          <h3 className="my-2">
            <Link
              to="/docs"
              className="no-underline font-bold hover:text-green-700 transition-colors"
            >
              Documentation
            </Link>
          </h3>
          <h3 className="my-2">
            <Link
              to="/pricing"
              className="no-underline font-bold hover:text-green-700 transition-colors"
            >
              <Trans>Pricing</Trans>
            </Link>
          </h3>
          <h3 className="my-2">
            <a
              href="https://feedback.obserfy.com"
              className="no-underline font-bold hover:text-green-700 transition-colors"
            >
              <Trans>Roadmap</Trans>
            </a>
          </h3>
          <h3 className="my-2">
            <a
              href="https://feedback.obserfy.com/changelog"
              className="no-underline font-bold hover:text-green-700 transition-colors"
            >
              <Trans>What&apos;s New</Trans>
            </a>
          </h3>
          {/* <h2> */}
          {/*  <Link */}
          {/*    to="/blog" */}
          {/*    className="no-underline font-bold hover:text-green-700 transition-colors" */}
          {/*  > */}
          {/*    Blog */}
          {/*  </Link> */}
          {/* </h2> */}
          <h3 className="my-2">
            <Link
              to="/contact"
              className="no-underline font-bold hover:text-green-700 transition-colors"
            >
              <Trans>Contact Us</Trans>
            </Link>
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Header
