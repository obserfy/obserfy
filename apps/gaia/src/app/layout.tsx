import "$styles/global.css"
import { FC, ReactNode } from "react"

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html lang="en">
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
