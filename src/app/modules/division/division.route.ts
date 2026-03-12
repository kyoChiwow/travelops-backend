import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { DivisonControllers } from "./division.controller";
import { createDivisionZodSchema, updateDivisionZodSchema } from "./division.validation";

const router = Router();

router.post(
  "/create",
  validateRequest(createDivisionZodSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisonControllers.createDivision,
);

router.get("/", DivisonControllers.getDivisions);
router.get("/:slug", DivisonControllers.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(updateDivisionZodSchema),
  DivisonControllers.updateDivison,
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisonControllers.deleteDivison,
);

export const DivisionRoutes = router;
