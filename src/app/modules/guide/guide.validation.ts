import z from "zod";
import { IGuideApplicationStatus } from "./guide.interface";

export const applyGuideZodSchema = z.object({
    divisionId: z.string({ message: "Division id is required!" }),
});

export const approveGuideZodSchema = z.object({
    status: z.enum([ IGuideApplicationStatus.APPROVED, IGuideApplicationStatus.REJECTED ])
});