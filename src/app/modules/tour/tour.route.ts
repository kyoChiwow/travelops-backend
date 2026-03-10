import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { updateDivisionZodSchema } from "../division/division.validation";
import { Role } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import { createTourTypeZodSchema } from "./tour.validation";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourControllers.createTourType,
);
router.get(
  "/all-tour-types",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
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

export const TourRoutes = router;
