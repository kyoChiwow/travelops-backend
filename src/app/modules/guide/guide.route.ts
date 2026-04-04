import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { GuideControllers } from "./guide.controller";
import { applyGuideZodSchema, approveGuideZodSchema } from "./guide.validation";

const router = Router();

router.post(
  "/apply",
  checkAuth(Role.USER),
  multerUpload.single("file"),
  validateRequest(applyGuideZodSchema),
  GuideControllers.applyForGuide,
);

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideControllers.getAllGuideApplications,
);

router.post(
  "/approve/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(approveGuideZodSchema),
  GuideControllers.approveRejectApplication,
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideControllers.getSingleApplication,
);

router.patch(
  "/archive/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  GuideControllers.archiveApplication,
);

export const GuideRoutes = router;
