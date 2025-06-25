import { Router } from "express"
import { InstrumentoController } from "../controllers/instrumentoController"

const router = Router()

router.get("/", InstrumentoController.getAllInstrumentos)
router.get("/:id", InstrumentoController.getInstrumentoById)

export default router