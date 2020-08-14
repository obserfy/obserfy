import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
import { min } from "@segment/snippet"

const { NEXT_PUBLIC_GAIA_SEGMENT_KEY = "" } = process.env

const renderSnippet = () => {
  const opts = {
    apiKey: NEXT_PUBLIC_GAIA_SEGMENT_KEY,
    page: true,
    load: false,
  }

  return min(opts)
}

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            href="/google-fonts/s/opensans/v17/mem5YaGs126MiZpBA-UN7rgOUuhp.woff2"
          />
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            href="/google-fonts/s/opensans/v17/mem5YaGs126MiZpBA-UN_r8OUuhp.woff2"
          />
          <link
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            href="/google-fonts/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0b.woff2"
          />
          {/* eslint-disable-next-line react/no-danger */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
window.segmentSnippetLoaded = false
window.segmentSnippetLoading = false

window.segmentSnippetLoader = function (callback) {
  if (!window.segmentSnippetLoaded && !window.segmentSnippetLoading) {
    window.segmentSnippetLoading = true

    function loader() {
      window.analytics.load(${NEXT_PUBLIC_GAIA_SEGMENT_KEY})
      window.segmentSnippetLoading = false
      window.segmentSnippetLoaded = true
      if (callback) {
        callback()
      }
    }

    setTimeout(function () {
      "requestIdleCallback" in window
        ? requestIdleCallback(function () {
            loader()
          })
        : loader()
    }, 1000)
  }
}
window.addEventListener(
  "scroll",
  function () {
    window.segmentSnippetLoader()
  },
  { once: true }
)
${renderSnippet()}`,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
