import express from "express";
import { deleteUser, getAllUsers, getUser, updateUser } from "../controller/userController.js";
const router = express.Router();

router.get("/users",getAllUsers);
router.get("/users/:id",getUser);
router.patch("/users/:id",updateUser);
router.delete("/users/:id",deleteUser);

export default router;