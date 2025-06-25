import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

export const testConnection = async () => {
  try {
    const client = await pool.connect()
    console.log("✅ Conexión a PostgreSQL exitosa")
    client.release()
  } catch (error) {
    console.error("❌ Error conectando a PostgreSQL:", error)
    process.exit(1)
  }
}

export default pool