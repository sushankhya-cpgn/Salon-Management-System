import { createAppointment } from "../controller/appointmentController.js";
import express from "express"
const router = express.Router()

router.post("/createAppointment",createAppointment)