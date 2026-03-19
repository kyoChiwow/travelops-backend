import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { BookingControllers } from "./booking.controller";
import {
  createBookingZodSchema,
  updateBookingStatusZodSchema,
} from "./booking.validation";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(Role)),
  validateRequest(createBookingZodSchema),
  BookingControllers.createBooking,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  BookingControllers.getAllBookings,
);

router.get(
  "/my-bookings",
  checkAuth(...Object.values(Role)),
  BookingControllers.getUserBookings,
);

router.get(
  "/:bookingId",
  checkAuth(...Object.values(Role)),
  BookingControllers.getSingleBooking,
);

router.patch(
  "/:bookingId/status",
  checkAuth(...Object.values(Role)),
  validateRequest(updateBookingStatusZodSchema),
  BookingControllers.updateBookingStatus,
);

export const BookingRoutes = router;
