import { z } from "zod";

export const forgotPasswordZodValidation = z.object({
  email: z.email({ message: "Invalid email format!" }),
});

export const resetPasswordZodValidation = z.object({
    id: z.string({ message: "Id is required!" }),
    newPassword: z.string().min(8, "Password must be at least 8 characters long")
});
