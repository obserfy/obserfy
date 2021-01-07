import { t, Trans } from "@lingui/macro"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React, { FC } from "react"
import Logo from "../images/logo-standalone.svg"

const Footer = () => (
  <footer className="px-3 py-3 py-16 mt-16 text-gray-700 bg-gray-50">
    <div className="md:flex max-w-7xl mx-auto">
      <div className="mr-16">
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

      <div className="mr-16">
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

      <div className="mr-16">
        <ExternalFooterLink
          text={t`GitHub`}
          to="https://github.com/obserfy/obserfy"
        />
        <InternalFooterLink to="/contact" text={t`Contact Us`} />
        <InternalFooterLink to="/privacy-policy" text={t`Privacy Policy`} />
      </div>
    </div>

    <div className="flex items-center max-w-7xl mx-auto">
      <div>© {new Date().getFullYear()} Obserfy</div>
    </div>
  </footer>
)

const InternalFooterLink: FC<{ to?: string; text: string }> = ({
  to,
  text,
}) => (
  <Link to={to} className="hover:underline">
    <h5 className="mb-3">
      <Trans id={text} />
    </h5>
  </Link>
)

const ExternalFooterLink: FC<{ to?: string; text: string }> = ({
  to,
  text,
}) => (
  <a href={to} className="hover:underline">
    <h5 className="mb-3">
      <Trans id={text} />
    </h5>
  </a>
)

export default Footer
