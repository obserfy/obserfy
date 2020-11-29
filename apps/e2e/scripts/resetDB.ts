const { Client } = require("pg")
const { config } = require("dotenv")

config({ path: "../../.env" })
config({ path: "../../.env.local" })

const [email] = process.argv.slice(2)

const client = new Client({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: "localhost",
  database: "defaultdb",
  port: parseInt(process.env.DB_PORT ?? "5432", 10),
})

const resetDB = async () => {
  await client.connect()
  try {
    // language=PostgreSQL
    await client.query("begin transaction")
    // language=PostgreSQL
    await client.query(`
        delete
        from guardians
        where email = '${email ?? ""}'
    `)
    // language=PostgreSQL
    await client.query("commit")
    await client.end()
  } catch (e) {
    console.log(e)
  }
}

resetDB()
