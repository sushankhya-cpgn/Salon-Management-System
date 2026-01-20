import { createAppointment, deleteAppointment, getAppointments, updateAppointment } from "../controller/appointmentController.js";
import express from "express"
const router = express.Router()

/**
 * @swagger
 * /api/appointment:
 *   get:
 *     tags:
 *       - Appointment
 *     summary: Retrieve all appointments
 *     description: Get a list of all appointments.
 *     responses:
 *       200:
 *         description: A list of appointments
 *       404:
 *         description: No appointments found
 *       500:
 *         description: Server error
 *
 *   post:
 *     tags:
 *       - Appointment
 *     summary: Create a new appointment
 *     description: Add a new appointment record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointment/{appointmentId}:
 *   patch:
 *     tags:
 *       - Appointment
 *     summary: Update an appointment
 *     description: Update details of an appointment.
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceId:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated
 *       400:
 *         description: Bad request
 *       404:
 *         description: Appointment not found
 *       409:
 *         description: Slot already booked
 *       500:
 *         description: Server error
 *
 *   delete:
 *     tags:
 *       - Appointment
 *     summary: Delete an appointment
 *     description: Remove an appointment by ID.
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Appointment deleted
 *       400:
 *         description: Bad request
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

router.get("/appointment", getAppointments)
router.post("/appointment", createAppointment)
router.patch("/appointment/:appointmentId", updateAppointment)
router.delete("/appointment", deleteAppointment)

export default router;