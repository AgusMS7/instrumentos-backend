import type { Request, Response } from "express"
import pool from "../config/database"

export class InstrumentoController {
  // Obtener todos los instrumentos con sus imágenes
  static async getAllInstrumentos(req: Request, res: Response) {
    try {
      // Query principal para obtener instrumentos
      const instrumentosResult = await pool.query(`
        SELECT 
          i.*,
          pi.id as image_id,
          pi.filename,
          pi.alt_text,
          pi.image_type,
          pi.display_order
        FROM instrumento i
        LEFT JOIN product_images pi ON i.id = pi.instrumento_id
        ORDER BY i.id, pi.image_type DESC, pi.display_order ASC
      `)

      if (instrumentosResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No se encontraron instrumentos",
        })
      }

      // Agrupar imágenes por instrumento
      const instrumentosMap = new Map()

      for (const row of instrumentosResult.rows) {
        const instrumentoId = row.id

        if (!instrumentosMap.has(instrumentoId)) {
          instrumentosMap.set(instrumentoId, {
            id: row.id,
            instrumento: row.instrumento,
            marca: row.marca,
            modelo: row.modelo,
            precio: row.precio,
            costoenvio: row.costoenvio,
            cantidadvendida: row.cantidadvendida,
            descripcion: row.descripcion,
            // Mantener imagen por compatibilidad
            imagen: null,
            images: [],
            main_image: null,
          })
        }

        // Agregar imagen si existe
        if (row.image_id) {
          const image = {
            id: row.image_id,
            filename: row.filename,
            alt_text: row.alt_text,
            image_type: row.image_type,
            display_order: row.display_order,
            url: `${req.protocol}://${req.get("host")}/images/${row.filename}`,
          }

          const instrumento = instrumentosMap.get(instrumentoId)
          instrumento.images.push(image)

          // Establecer imagen principal
          if (row.image_type === "main" || !instrumento.main_image) {
            instrumento.main_image = image
            instrumento.imagen = row.filename // Compatibilidad
          }
        }
      }

      const instrumentos = Array.from(instrumentosMap.values())
      res.json(instrumentos)
    } catch (error) {
      console.error("Error al obtener instrumentos:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      })
    }
  }

  // Obtener un instrumento por ID con sus imágenes
  static async getInstrumentoById(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "ID del instrumento es requerido",
        })
      }

      const result = await pool.query(
        `
        SELECT 
          i.*,
          pi.id as image_id,
          pi.filename,
          pi.alt_text,
          pi.image_type,
          pi.display_order
        FROM instrumento i
        LEFT JOIN product_images pi ON i.id = pi.instrumento_id
        WHERE i.id = $1
        ORDER BY pi.image_type DESC, pi.display_order ASC
      `,
        [id],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: `No se encontró el instrumento con ID: ${id}`,
        })
      }

      // Construir objeto instrumento con imágenes
      const firstRow = result.rows[0]
      const instrumento = {
        id: firstRow.id,
        instrumento: firstRow.instrumento,
        marca: firstRow.marca,
        modelo: firstRow.modelo,
        precio: firstRow.precio,
        costoenvio: firstRow.costoenvio,
        cantidadvendida: firstRow.cantidadvendida,
        descripcion: firstRow.descripcion,
        imagen: null, // Compatibilidad
        images: [] as any[],
        main_image: null as any,
      }

      // Agregar imágenes
      for (const row of result.rows) {
        if (row.image_id) {
          const image = {
            id: row.image_id,
            filename: row.filename,
            alt_text: row.alt_text,
            image_type: row.image_type,
            display_order: row.display_order,
            url: `${req.protocol}://${req.get("host")}/images/${row.filename}`,
          }

          instrumento.images.push(image)

          // Establecer imagen principal
          if (row.image_type === "main" || !instrumento.main_image) {
            instrumento.main_image = image
            instrumento.imagen = row.filename // Compatibilidad
          }
        }
      }

      res.json(instrumento)
    } catch (error) {
      console.error("Error al obtener instrumento por ID:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      })
    }
  }

  // Crear un nuevo instrumento
  static async createInstrumento(req: Request, res: Response) {
    try {
      const { instrumento, marca, modelo, imagen, precio, costoEnvio, cantidadVendida, descripcion } = req.body

      // Validaciones básicas
      if (!instrumento || !marca || !modelo || !precio) {
        return res.status(400).json({
          success: false,
          message: "Los campos instrumento, marca, modelo y precio son requeridos",
        })
      }

      const result = await pool.query(
        `INSERT INTO instrumento (instrumento, marca, modelo, precio, costoEnvio, cantidadVendida, descripcion) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [instrumento, marca, modelo, precio, costoEnvio || "0", cantidadVendida || "0", descripcion || ""],
      )

      res.status(201).json({
        success: true,
        message: "Instrumento creado exitosamente",
        data: result.rows[0],
      })
    } catch (error) {
      console.error("Error al crear instrumento:", error)
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      })
    }
  }
}
