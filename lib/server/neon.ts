import { neon } from '@neondatabase/serverless'

export type NeonSql = ReturnType<typeof neon>

export const getDatabaseUrl = (): string | null =>
  process.env.DATABASE_URL?.trim() || null

export const getNeonSql = (): NeonSql | null => {
  const connectionString = getDatabaseUrl()
  if (!connectionString) return null
  return neon(connectionString)
}

export const withNeonSql = async <T>(
  run: (sql: NeonSql) => Promise<T>,
): Promise<T | null> => {
  const sql = getNeonSql()
  if (!sql) return null
  return run(sql)
}
