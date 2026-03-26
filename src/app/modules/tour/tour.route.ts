import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { TourControllers } from "./tour.controller";
import {
  createTourTypeZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

// Tour type routes
router.post(
  "/create-tour-type",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourControllers.createTourType,
);
router.get("/all-tour-types", TourControllers.getAllTourTypes);
router.get("/tour-type/:slug", TourControllers.getSingleTourType);
router.patch(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.updateTourType,
);
router.delete(
  "/tour-type/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTourType,
);
// Tour type routes

// Tour Routes
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(createTourZodSchema),
  TourControllers.createTour,
);

router.get("/", TourControllers.getTours);

router.get("/:slug", TourControllers.getSingleTour);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUpload.array("files"),
  validateRequest(updateTourZodSchema),
  TourControllers.updateTour,
);

router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  TourControllers.deleteTour,
);
// Tour Routes

export const TourRoutes = router;
