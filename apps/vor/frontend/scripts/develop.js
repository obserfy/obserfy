/**
 * Starts `gatsby develop` with the given args.
 *
 * Gatsby 4's file/url loaders hash with md4, which Node 17+ only allows with OpenSSL's
 * legacy provider ("error:0308010C:digital envelope routines::unsupported"). Node 16
 * rejects that flag, so only add it on newer Node versions.
 */
const { spawnSync } = require("child_process")

const LEGACY_OPENSSL = "--openssl-legacy-provider"
const env = { ...process.env }
const nodeOptions = env.NODE_OPTIONS || ""
const nodeMajor = Number(process.versions.node.split(".")[0])
if (nodeMajor >= 17 && !nodeOptions.includes(LEGACY_OPENSSL)) {
  env.NODE_OPTIONS = `${nodeOptions} ${LEGACY_OPENSSL}`.trim()
}

const { status, error } = spawnSync(
  "gatsby",
  ["develop", ...process.argv.slice(2)],
  {
    stdio: "inherit",
    env,
    shell: process.platform === "win32",
  }
)
if (error) throw error
process.exit(status === null ? 1 : status)
