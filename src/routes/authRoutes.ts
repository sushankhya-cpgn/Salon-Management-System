import express from 'express';
import { login, refreshToken, register, verifyEmail } from "../controller/authController.js";

const router = express.Router();


/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 */
 router.post("/register",register);


/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     responses:
 *       200:
 *         description: User logged in successfully
 */
router.post("/login",login);

router.post("/refresh-token",refreshToken)

router.get("/verify-email",verifyEmail)

export default router;