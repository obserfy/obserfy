// @ts-nocheck
/* eslint-disable */
export default function loadCanny() {
  ;(function (w, d, i, s) {
    function l() {
      if (!d.getElementById(i)) {
        const f = d.getElementsByTagName(s)[0]
        const e = d.createElement(s)
        ;(e.type = "text/javascript"),
          (e.async = !0),
          (e.src = "https://canny.io/sdk.js"),
          f.parentNode.insertBefore(e, f)
      }
    }
    if (typeof w.Canny !== "function") {
      var c = function () {
        c.q.push(arguments)
      }
      ;(c.q = []),
        (w.Canny = c),
        d.readyState === "complete"
          ? l()
          : w.attachEvent
          ? w.attachEvent("onload", l)
          : w.addEventListener("load", l, !1)
    }
  })(window, document, "canny-jssdk", "script")
}
