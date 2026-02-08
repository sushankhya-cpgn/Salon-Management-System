import express from 'express'
import { availableSlots } from '../controller/slotController.js';
const router = express.Router()


/**
 * @swagger
 * /api/slots/{serviceId}:
 *   get:
 *     tags:
 *       - Slots
 *     summary: Get available appointment slots
 *     description: Retrieve all available time slots for a specific service on a given date (9:00 AM - 3:00 PM, excluding lunch 12:00 PM - 2:00 PM). If no date is provided, returns slots for today.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: The ID of the service
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-02-08"
 *         description: The date to get available slots for (YYYY-MM-DD format). Defaults to today if not provided.
 *     responses:
 *       200:
 *         description: A list of available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["09:00", "09:30", "10:00", "10:30", "11:00"]
 *                 date:
 *                   type: string
 *                   example: "2026-02-08"
 *                 serviceId:
 *                   type: number
 *                   example: 1
 *                 serviceName:
 *                   type: string
 *                   example: "Hair Cut"
 *       400:
 *         description: Missing service ID or invalid date format
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server error
 */

router.get("/:serviceId",availableSlots);

export default router;


