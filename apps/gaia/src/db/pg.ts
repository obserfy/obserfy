import { Pool } from "pg"
import { isLeft } from "fp-ts/Either"
import { Decoder } from "io-ts"

const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT ?? "5432", 10),
  max: parseInt(process.env.MAX_CLIENTS ?? "10", 10),
  ssl: process.env.NODE_ENV === "production" && {
    cert: process.env.PG_CERT,
    rejectUnauthorized: false,
  },
})

pgPool.on("error", (err) => {
  console.error("Unexpected error in PostgresSQL connection pool", err)
})

export const query = async (sql: string, params: string[]) => {
  const client = await pgPool.connect()
  try {
    return await client.query(sql, params)
  } finally {
    client.release()
  }
}

export const typedQuery = async <T>(
  decoder: Decoder<any, T>,
  params: string[],
  sql: string
): Promise<T> => {
  const client = await pgPool.connect()
  try {
    const queryResult = await client.query(sql, params)
    const rows = decoder.decode(queryResult.rows)
    if (isLeft(rows)) {
      console.log(JSON.stringify(rows.left))
      throw Error("query result type mismatch")
    }
    return rows.right
  } finally {
    client.release()
  }
}
