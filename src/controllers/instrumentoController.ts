import type { Request, Response } from "express"
import pool from "../config/database"

export class InstrumentoController {
  static async getAllInstrumentos(req: Request, res: Response) {
    try {
      const result = await pool.query("SELECT * FROM instrumento ORDER BY id")
      
      res.json(result.rows)
    } catch (error) {
      console.error("Error al obtener instrumentos:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      })
    }
  }

  static async getInstrumentoById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await pool.query("SELECT * FROM instrumento WHERE id = $1", [id])

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el instrumento con ID: ${id}`
        })
      }

      res.json(result.rows[0])
    } catch (error) {
      console.error("Error al obtener instrumento por ID:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor"
      })
    }
  }
}