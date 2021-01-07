import { Trans } from "@lingui/macro"
import React, { FC, useState } from "react"
import CloseIcon from "../icons/close.svg"
import MenuIcon from "../icons/menu.svg"
import Button from "./Button/Button"
import { Link } from "./Link"

const DocsHeader: FC = () => {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showSignInButton, setShowSignInButton] = useState(false)
  return (
    <>
      <header
        className="
        backdrop-blur md:backdrop-none
        p-3
        sticky top-0
        z-10
        w-full
      "
      >
        <div className="flex flex-row items-center ">
          <div className="hidden md:flex items-center ml-auto">
            <a href="https://parent.obserfy.com/api/login" className="ml-2">
              <Button secondary className="px-3 py-2 text-xs border">
                <Trans>Sign In for Parents</Trans>
              </Button>
            </a>
            <a href="https://app.obserfy.com" className="ml-2">
              <Button secondary className="px-3 py-2 text-xs text-green-700">
                <Trans>Sign in for Teachers</Trans>
              </Button>
            </a>
          </div>

          <Button
            secondary
            className="px-3 py-2 text-sm border md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <img alt="open menu" src={MenuIcon} />
          </Button>

          <button
            className={`ml-auto mr-4 font-bold text-green-700 md:hidden p-2 ${
              showSignInButton ? "border-b-2 border-green-700" : ""
            }`}
            onClick={() => setShowSignInButton(!showSignInButton)}
          >
            Sign In
          </button>
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

const Sidebar: FC<{ show: boolean; onClose: () => void }> = ({
  show,
  onClose,
}) => {
  return (
    <div
      className={`fixed shadow w-4/5 h-full left-0 ${
        show ? "" : "-left-full"
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

export default DocsHeader
