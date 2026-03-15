import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";

const router = Router();


router.post("/", checkAuth(...Object.values(Role)), validateRequest(createBookingZodSchema), );