/* eslint-disable react/no-danger */
import ErrorBoundary from "$components/ErrorBoundary"
import useInitAnalytics from "$hooks/useInitAnalytics"
import "$styles/global.css"
import { UserProvider } from "@auth0/nextjs-auth0"
import "@fontsource/open-sans/400.css"
import "@fontsource/open-sans/500.css"
import "@fontsource/open-sans/700.css"
import { NextPage } from "next"
import { AppProps } from "next/app"
import Script from "next/script"
import { QueryClient, QueryClientProvider } from "react-query"

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
