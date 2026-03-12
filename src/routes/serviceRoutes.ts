import express, { Router } from "express"
import { getService } from "../controller/serviceController.js";

const router = Router();

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Retrieve all services
 *     description: Get a list of all services in the system.
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *       500:
 *         description: Internal server error
 */

router.get("/",getService)

export default router;