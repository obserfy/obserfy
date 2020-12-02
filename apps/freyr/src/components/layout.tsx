/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React, { FC } from "react"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import { Trans } from "@lingui/macro"
import Header from "./header"
import "./global.css"

const Layout: FC = ({ children }) => {
  return (
    <div
      className="bg-cover min-h-screen"
      style={{
        // animated
        // backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='520' height='1440' preserveAspectRatio='none' viewBox='0 0 520 1440'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1000%26quot%3b)' fill='none'%3e%3cpath d='M509.485%2c236.901C539.068%2c234.403%2c562.43%2c215.056%2c577.88%2c189.705C594.155%2c163%2c605.244%2c130.995%2c590.993%2c103.158C575.671%2c73.229%2c543.107%2c56.295%2c509.485%2c56.109C475.533%2c55.921%2c444.377%2c73.444%2c426.399%2c102.247C407.223%2c132.969%2c398.636%2c172.416%2c417.653%2c203.236C436.003%2c232.974%2c474.665%2c239.842%2c509.485%2c236.901' fill='rgba(177%2c 177%2c 177%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M160.306%2c57.064C182.297%2c56.796%2c201.672%2c42.217%2c211.16%2c22.376C219.554%2c4.823%2c211.944%2c-14.337%2c202.614%2c-31.411C192.724%2c-49.51%2c180.863%2c-69.015%2c160.306%2c-70.688C137.408%2c-72.552%2c115.369%2c-59.455%2c104.108%2c-39.43C93.049%2c-19.764%2c95.9%2c4.148%2c107.255%2c23.645C118.528%2c43.002%2c137.908%2c57.337%2c160.306%2c57.064' fill='rgba(177%2c 177%2c 177%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1.358%2c517.514C19.092%2c518.595%2c37.622%2c512.892%2c47.022%2c497.815C56.903%2c481.967%2c56.658%2c461.038%2c46.228%2c445.546C36.752%2c431.471%2c18.323%2c430.227%2c1.358%2c429.989C-16.223%2c429.743%2c-36.827%2c429.103%2c-45.743%2c444.258C-54.725%2c459.524%2c-45.165%2c477.883%2c-35.586%2c492.781C-26.996%2c506.142%2c-14.497%2c516.548%2c1.358%2c517.514' fill='rgba(177%2c 177%2c 177%2c 0.4)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M453.521%2c1023.179C466.487%2c1023.129%2c478.63%2c1016.365%2c484.961%2c1005.05C491.154%2c993.983%2c489.934%2c980.518%2c483.509%2c969.584C477.175%2c958.803%2c466%2c952.336%2c453.521%2c951.54C439.301%2c950.633%2c423.346%2c953.024%2c416.08%2c965.281C408.72%2c977.698%2c413.819%2c993.174%2c421.657%2c1005.294C428.746%2c1016.256%2c440.467%2c1023.229%2c453.521%2c1023.179' fill='rgba(177%2c 177%2c 177%2c 0.4)' class='triangle-float2'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1000'%3e%3crect width='520' height='1440' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cstyle%3e %40keyframes float1 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-10px%2c 0)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float1 %7b animation: float1 10s infinite%3b %7d %40keyframes float2 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(-5px%2c -5px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float2 %7b animation: float2 8s infinite%3b %7d %40keyframes float3 %7b 0%25%7btransform: translate(0%2c 0)%7d 50%25%7btransform: translate(0%2c -10px)%7d 100%25%7btransform: translate(0%2c 0)%7d %7d .triangle-float3 %7b animation: float3 12s infinite%3b %7d %3c/style%3e%3c/defs%3e%3c/svg%3e")`,
        // non-animated
        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='520' height='1440' preserveAspectRatio='none' viewBox='0 0 520 1440'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1001%26quot%3b)' fill='none'%3e%3cpath d='M509.485%2c236.901C539.068%2c234.403%2c562.43%2c215.056%2c577.88%2c189.705C594.155%2c163%2c605.244%2c130.995%2c590.993%2c103.158C575.671%2c73.229%2c543.107%2c56.295%2c509.485%2c56.109C475.533%2c55.921%2c444.377%2c73.444%2c426.399%2c102.247C407.223%2c132.969%2c398.636%2c172.416%2c417.653%2c203.236C436.003%2c232.974%2c474.665%2c239.842%2c509.485%2c236.901' fill='rgba(177%2c 177%2c 177%2c 0.2)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M160.306%2c57.064C182.297%2c56.796%2c201.672%2c42.217%2c211.16%2c22.376C219.554%2c4.823%2c211.944%2c-14.337%2c202.614%2c-31.411C192.724%2c-49.51%2c180.863%2c-69.015%2c160.306%2c-70.688C137.408%2c-72.552%2c115.369%2c-59.455%2c104.108%2c-39.43C93.049%2c-19.764%2c95.9%2c4.148%2c107.255%2c23.645C118.528%2c43.002%2c137.908%2c57.337%2c160.306%2c57.064' fill='rgba(177%2c 177%2c 177%2c 0.2)' class='triangle-float1'%3e%3c/path%3e%3cpath d='M1.358%2c517.514C19.092%2c518.595%2c37.622%2c512.892%2c47.022%2c497.815C56.903%2c481.967%2c56.658%2c461.038%2c46.228%2c445.546C36.752%2c431.471%2c18.323%2c430.227%2c1.358%2c429.989C-16.223%2c429.743%2c-36.827%2c429.103%2c-45.743%2c444.258C-54.725%2c459.524%2c-45.165%2c477.883%2c-35.586%2c492.781C-26.996%2c506.142%2c-14.497%2c516.548%2c1.358%2c517.514' fill='rgba(177%2c 177%2c 177%2c 0.2)' class='triangle-float2'%3e%3c/path%3e%3cpath d='M453.521%2c1023.179C466.487%2c1023.129%2c478.63%2c1016.365%2c484.961%2c1005.05C491.154%2c993.983%2c489.934%2c980.518%2c483.509%2c969.584C477.175%2c958.803%2c466%2c952.336%2c453.521%2c951.54C439.301%2c950.633%2c423.346%2c953.024%2c416.08%2c965.281C408.72%2c977.698%2c413.819%2c993.174%2c421.657%2c1005.294C428.746%2c1016.256%2c440.467%2c1023.229%2c453.521%2c1023.179' fill='rgba(177%2c 177%2c 177%2c 0.4)' class='triangle-float3'%3e%3c/path%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1001'%3e%3crect width='520' height='1440' fill='white'%3e%3c/rect%3e%3c/mask%3e%3c/defs%3e%3c/svg%3e")`,
      }}
    >
      <Header />
      <div className="max-w-7xl mx-auto">
        <main>{children}</main>
        <footer className="px-3 text-center py-3 flex items-center pt-8 text-gray-700">
          <div>© {new Date().getFullYear()} Obserfy</div>
          <Link to="/privacy-policy" className="ml-3 underline">
            <Trans>Privacy Policy</Trans>
          </Link>
        </footer>
      </div>
    </div>
  )
}

export default Layout
