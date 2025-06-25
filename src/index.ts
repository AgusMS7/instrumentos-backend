import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { testConnection } from "./config/database"
import instrumentoRoutes from "./routes/instrumentoRoutes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
)
app.use(express.json())

// Servir archivos estáticos (imágenes)
app.use("/images", express.static(path.join(__dirname, "../public/images")))

// Rutas
app.get("/", (req, res) => {
  res.json({
    message: "API de Instrumentos Sandoval funcionando",
    version: "1.0.0",
    endpoints: {
      instrumentos: "/api/instrumentos",
      instrumento_por_id: "/api/instrumentos/:id",
      images: "/images/:filename",
    },
  })
})

app.use("/api/instrumentos", instrumentoRoutes)

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`,
  })
})

// Iniciar servidor
const startServer = async () => {
  try {
    await testConnection()
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`📊 API disponible en http://localhost:${PORT}/api/instrumentos`)
      console.log(`🖼️  Imágenes disponibles en http://localhost:${PORT}/images/`)
    })
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error)
    process.exit(1)
  }
}

startServer()
