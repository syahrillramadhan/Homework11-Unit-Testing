import express from "express";
import { userRoutes } from "./user_routes.js";
import { todoRoutes } from "./todo_routes.js";
import { authentication } from "../middlewares/auth.js";

const router = express.Router();

router.use("/api", userRoutes);
router.use("/api", authentication, todoRoutes);

export { router };
