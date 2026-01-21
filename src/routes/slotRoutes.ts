import express from 'express'
import { availableSlots } from '../controller/slotController.js';
const router = express.Router()


router.get("/:serviceId",availableSlots);

export default router;


