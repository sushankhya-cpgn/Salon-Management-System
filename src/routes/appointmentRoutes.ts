import express from "express"
import multer from "multer"
import { bulkAppointment } from "../controller/appointmentController.js";
import { createAppointment, deleteAppointment, getAppointments, updateAppointment } from "../controller/appointmentController.js";
const router = express.Router()
const upload = new multer({dest:"uploads/"})

/**
 * @swagger
 * /api/appointment:
 *   get:
 *     tags:
 *       - Appointment
 *     summary: Retrieve all appointments
 *     description: Get a list of all appointments in the system.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of appointments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   customerName:
 *                     type: string
 *                   email:
 *                     type: string
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   endTime:
 *                     type: string
 *                     format: date-time
 *                   serviceId:
 *                     type: number
 *       404:
 *         description: No appointments found
 *       500:
 *         description: Server error
 *
 *   post:
 *     tags:
 *       - Appointment
 *     summary: Create a new appointment
 *     description: Add a new appointment record with conflict checking.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - email
 *               - date
 *               - startTime
 *               - serviceId
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-02-08
 *               startTime:
 *                 type: string
 *                 example: "10:00"
 *               serviceId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 appointment:
 *                   type: object
 *       400:
 *         description: Missing required fields or invalid service
 *       409:
 *         description: Slot already booked
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
 *     description: Update details of an existing appointment with conflict checking.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerName:
 *                 type: string
 *               email:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               serviceId:
 *                 type: number
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 updatedAppointment:
 *                   type: object
 *       400:
 *         description: Missing appointment ID or invalid service
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
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       400:
 *         description: Missing appointment ID
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/appointment/bulk:
 *   post:
 *     tags:
 *       - Appointment
 *     summary: Bulk import appointments from CSV
 *     description: Upload a CSV file to import multiple appointments. The file is processed asynchronously and conflicts are automatically skipped.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file with columns - customerName, email, date, startTime, serviceId
 *     responses:
 *       200:
 *         description: File received and processing in background
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File received and processing in background
 *       400:
 *         description: CSV file is required
 *       500:
 *         description: Internal server error
 */

router.get("/", getAppointments)
router.post("/", createAppointment)
router.patch("/:appointmentId", updateAppointment)
router.delete("/", deleteAppointment)
router.post("/bulk",upload.single("file"),bulkAppointment)

export default router;