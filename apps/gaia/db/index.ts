import { Pool } from "pg"

const pgPool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10),
  max: parseInt(process.env.MAX_CLIENTS, 10) || 10,
})

pgPool.on("error", (err) => {
  console.error("Unexpected error in Postgress connection pool", err)
})

export const queryChildrenByGuardianEmail = async (guardianEmail: string) => {
  const client = await pgPool.connect()

  // language=PostgreSQL
  const result = await client.query<{ name: string }>(`
      SELECT s.id, s.name
      FROM students s
      JOIN guardian_to_students gts ON s.id = gts.student_id
      JOIN guardians g ON gts.guardian_id = g.id
      WHERE g.email = '${guardianEmail}'
  `)
  return result.rows
}
