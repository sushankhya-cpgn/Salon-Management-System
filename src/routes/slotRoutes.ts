import express from 'express'
import { availableSlots } from '../controller/slotController.js';
const router = express.Router()


/**
 * @swagger
 * /api/slots/{serviceId}:
 *   get:
 *     tags:
 *       - Slot
 *     parameters:
 *      - in: path
 *       required: true
 *           schema:
 *             type: number
 *             properties:
 *               serviceId:
 *                 type: number
 *     summary: Get All Available Slots
 *     description: Get a list of all available slot for a service.
 *     responses:
 *       200:
 *         description: A list of slots
 *       500:
 *         description: Server error
 */

router.get("/:serviceId",availableSlots);

export default router;


