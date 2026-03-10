import z from "zod";

export const createTourTypeZodSchema = z.object({
    name: z 
        .string({ error: (issue) => issue.code === "invalid_type" ? "Name must be string" : "Name is required", })
        .min(2, { message: "Name must be at least 2 characters long!" })
        .max(50, { message: "Name cannot exceed 50 characters." }),
})

export const updateTourTypeZodSchema = z.object({
    name: z 
        .string({ error: (issue) => issue.code === "invalid_type" ? "Name must be string" : "Name is required", })
        .min(2, { message: "Name must be at least 2 characters long!" })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
})