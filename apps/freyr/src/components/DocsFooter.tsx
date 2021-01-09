import { t, Trans } from "@lingui/macro"
import React, { FC } from "react"
import Logo from "../images/logo-standalone.svg"
import { Link } from "./Link"

const DocsFooter = () => (
  <footer className="px-6 py-8 md:py-16 text-gray-700 bg-gray-50">
    <div className="md:flex">
      <div className="mr-16 flex-1">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} className="w-8" alt="logo" />
            <h1 className="text-xl ml-2 font-bold font-body">Obserfy</h1>
          </Link>
        </div>

        <p className="my-3 max-w-sm">
          Open-source Montessori record keeping software and parent
          communication tool.
        </p>
      </div>

      <div className="flex my-8 md:my-0 flex-1">
        <div className="mr-16 flex-1">
          <InternalFooterLink to="/docs" text={t`Documentation`} />
          <InternalFooterLink to="/pricing" text={t`Pricing`} />
          <ExternalFooterLink
            text={t`Roadmap`}
            to="https://feedback.obserfy.com"
          />
          <ExternalFooterLink
            text={t`What's New`}
            to="https://feedback.obserfy.com/changelog"
          />
        </div>

        <div className="flex-1">
          <ExternalFooterLink
            text={t`GitHub`}
            to="https://github.com/obserfy/obserfy"
          />
          <InternalFooterLink to="/contact" text={t`Contact Us`} />
          <InternalFooterLink to="/privacy-policy" text={t`Privacy Policy`} />
        </div>
      </div>
    </div>

    <div className="flex items-center">
      <div>© {new Date().getFullYear()} Obserfy</div>
    </div>
  </footer>
)

const InternalFooterLink: FC<{ to?: string; text: string }> = ({
  to,
  text,
}) => (
  <Link to={to} className="hover:underline">
    <h5 className="mb-3 font-bold whitespace-nowrap">
      <Trans id={text} />
    </h5>
  </Link>
)

const ExternalFooterLink: FC<{ to?: string; text: string }> = ({
  to,
  text,
}) => (
  <a href={to} className="hover:underline">
    <h5 className="mb-3 font-bold whitespace-nowrap">
      <Trans id={text} />
    </h5>
  </a>
)

export default DocsFooter
