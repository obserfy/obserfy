/* eslint-disable react/no-danger */
import { NextPage } from "next"
import { AppProps } from "next/app"
import Head from "next/head"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ErrorBoundary from "$components/ErrorBoundary"
import LoadMixpanel from "$components/LoadMixpanel"
import LoadSentry from "$components/LoadSentry"
import "$styles/global.css"
import "@fontsource/source-sans-pro/400.css"
import "@fontsource/source-sans-pro/600.css"
import "@fontsource/source-sans-pro/700.css"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: "tracked",
    },
  },
})

const App: NextPage<AppProps> = ({ Component, pageProps }) => (
  <ErrorBoundary>
    <Head>
      <title>Obserfy for Parents</title>
      <meta name="theme-color" content="#ffffff" />
      <link rel="apple-touch-icon" href="/icons/apple-icon-192.png" />
      <link rel="manifest" href="/manifest.webmanifest" />
    </Head>

    <LoadMixpanel />
    <LoadSentry />
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
