/* eslint-disable react/no-danger */
import "$styles/global.css"
import { UserProvider } from "@auth0/nextjs-auth0"
import "@fontsource/source-sans-pro/400.css"
import "@fontsource/source-sans-pro/600.css"
import "@fontsource/source-sans-pro/700.css"
import { NextPage } from "next"
import { AppProps } from "next/app"
import Script from "next/script"
import { QueryClient, QueryClientProvider } from "react-query"
import ErrorBoundary from "$components/ErrorBoundary"
import useInitAnalytics from "$hooks/useInitAnalytics"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: "tracked",
    },
  },
})

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  useInitAnalytics()

  return (
    <ErrorBoundary>
      <Script
        src="https://js.sentry-cdn.com/cb901298e868441898d8717f07a20188.min.js"
        crossOrigin="anonymous"
        data-lazy="no"
        strategy="beforeInteractive"
        onLoad={() => {
          Sentry.init({})
        }}
      />

      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </UserProvider>
    </ErrorBoundary>
  )
}

export default App
