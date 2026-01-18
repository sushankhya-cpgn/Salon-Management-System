import { createAppointment, updateAppointment } from "../controller/appointmentController.js";
import express from "express"
const router = express.Router()

router.post("/createAppointment",createAppointment)
router.patch("/updateAppointment",updateAppointment)

export default router;