import z from "zod";

export const createDivisionZodSchema = z.object({
    name: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Name must be string" : "Name is required", })
        .min(2, { message: "Name must be at least 2 characters long!" })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    slug: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Slug must be string" : "Slug is required", })
        .min(2, { message: "Slug must be at least 2 characters long!" })
        .max(50, { message: "Slug cannot exceed 50 characters." }),
    thumbnail: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Thumbnail must be string" : "Thumbnail is required", })
        .optional(),
    description: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Description must be string" : "Description is required", })
        .optional(),
})

export const updateDivisionZodSchema = z.object({
    name: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Name must be string" : "Name is required", })
        .min(2, { message: "Name must be at least 2 characters long!" })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    slug: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Slug must be string" : "Slug is required", })
        .min(2, { message: "Slug must be at least 2 characters long!" })
        .max(50, { message: "Slug cannot exceed 50 characters." })
        .optional(),
    thumbnail: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Thumbnail must be string" : "Thumbnail is required", })
        .optional(),
    description: z
        .string({ error: (issue) => issue.code === "invalid_type" ? "Description must be string" : "Description is required", })
        .optional(),
})