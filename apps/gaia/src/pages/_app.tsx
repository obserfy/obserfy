/* eslint-disable react/no-danger */
import { NextPage } from "next"
import { AppProps } from "next/app"
import { QueryClient, QueryClientProvider } from "react-query"
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
    <LoadMixpanel />
    <LoadSentry />
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  </ErrorBoundary>
)

export default App
