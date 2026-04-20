import { neon } from '@neondatabase/serverless'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const migrationsDir = path.resolve(__dirname, '../db/migrations')

const databaseUrl = process.env.DATABASE_URL?.trim()
if (!databaseUrl) {
  console.error('DATABASE_URL is required to run migrations.')
  process.exit(1)
}

const sql = neon(databaseUrl)

const splitStatements = (source) => source
  .split(/;\s*\n/g)
  .map((statement) => statement.trim())
  .filter(Boolean)

const ensureMigrationTable = async () => {
  await sql.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

const getMigrationFiles = async () => {
  const entries = await readdir(migrationsDir)
  return entries.filter((entry) => entry.endsWith('.sql')).sort()
}

const getAppliedVersions = async () => {
  const rows = await sql.query('SELECT version FROM schema_migrations ORDER BY version ASC')
  return new Set(rows.map((row) => row.version))
}

const run = async () => {
  await ensureMigrationTable()
  const files = await getMigrationFiles()
  const applied = await getAppliedVersions()

  if (files.length === 0) {
    console.log('No migration files found.')
    return
  }

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip ${file}`)
      continue
    }

    const migrationSource = await readFile(path.join(migrationsDir, file), 'utf8')
    const statements = splitStatements(migrationSource)
    console.log(`apply ${file}`)

    for (const statement of statements) {
      await sql.query(statement)
    }

    await sql.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file])
  }

  console.log('Migration run complete.')
}

run().catch((error) => {
  console.error('Migration run failed.')
  console.error(error)
  process.exit(1)
})
