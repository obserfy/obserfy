/* eslint-disable react/no-danger */
import { UserProvider } from "@auth0/nextjs-auth0"
import { AppProps } from "next/app"
import { FC } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { ReactQueryDevtools } from "react-query/devtools"
import ErrorBoundary from "../components/ErrorBoundary"
import Layout from "../components/layout"
import "../global.css"
import useInitAnalytics from "../hooks/useInitAnalytics"
import { initSentry } from "../utils/sentry"

initSentry()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: "tracked",
    },
  },
})

const App: FC<AppProps> = ({ Component, pageProps }) => {
  useInitAnalytics()

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <LoadFonts />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

const LoadFonts = () => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
          @font-face {
            font-family: "Open Sans";
            font-style: normal;
            font-weight: 400;
            src: local("Open Sans Regular"), local("OpenSans-Regular"),
              url(/google-fonts/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0b.woff2)
                format("woff2"),
              url(/google-fonts/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0d.woff)
                format("woff");
            font-display: swap;
          }
          
          @font-face {
            font-family: "Open Sans";
            font-style: normal;
            font-weight: 700;
            src: local("Open Sans Bold"), local("OpenSans-Bold"),
              url(/google-fonts/s/opensans/v17/mem5YaGs126MiZpBA-UN7rgOUuhp.woff2)
                format("woff2"),
              url(/google-fonts/s/opensans/v17/mem5YaGs126MiZpBA-UN7rgOUuhv.woff)
                format("woff");
            font-display: swap;
          }
          
          html {
            font-family: "Open Sans", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu,
              Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Helvetica Neue",
              Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
              "Noto Color Emoji";
          } `,
    }}
  />
)

export default App
