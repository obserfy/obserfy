import { Trans } from "@lingui/macro"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import React from "react"

const Footer = () => (
  <footer className="px-3 text-center py-3 flex items-center pt-8 text-gray-700 max-w-7xl mx-auto">
    <div>© {new Date().getFullYear()} Obserfy</div>
    <Link to="/privacy-policy" className="ml-3 underline">
      <Trans>Privacy Policy</Trans>
    </Link>
  </footer>
)

export default Footer
