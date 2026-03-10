import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateDivisionZodSchema } from "../division/division.validation";
import { Role } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
} from "./tour.validation";

const router = Router();

// Tour type routes
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourControllers.createTourType,
);
router.get(
  "/all-tour-types",
  TourControllers.getAllTourTypes,
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionZodSchema),
  TourControllers.updateTourType,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTourType,
);
// Tour type routes

// Tour Routes
router.post(
  "/create",
  validateRequest(createTourZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN,),
  TourControllers.createTour,
);

router.get(
  "/all-tours",
  TourControllers.getTours,
);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionZodSchema),
  TourControllers.updateTour,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTour,
);
// Tour Routes

export const TourRoutes = router;
