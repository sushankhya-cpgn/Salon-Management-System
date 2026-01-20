import { createAppointment, deleteAppointment, updateAppointment } from "../controller/appointmentController.js";
import express from "express"
const router = express.Router()

router.get("/appointment")
router.post("/appointment",createAppointment)
router.patch("/appointment",updateAppointment)
router.delete("/appointment",deleteAppointment)

export default router;