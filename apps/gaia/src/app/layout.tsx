import "$styles/global.css"
import { Source_Sans_3 } from "next/font/google"
import { FC, ReactNode } from "react"

const sourceSansPro = Source_Sans_3({
  weight: ["400", "600", "700"],
  subsets: ["latin-ext"],
  display: "swap",
})

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html lang="en" className={sourceSansPro.className}>
    <body>{children}</body>
  </html>
)

export const metadata = {
  title: "Parents Dashboard - Obserfy",
  description: "Obserfy Parents Dashboard",
  themeColor: "#ffffff",
  manifest: "/manifest.webmanifest",
}

export default RootLayout
