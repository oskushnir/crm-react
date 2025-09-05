import { z } from "zod";

export const clientFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters long")
    .regex(/^[a-zA-Z]+$/, "First name must contain only letters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters long")
    .regex(/^[a-zA-Z]+$/, "Last name must contain only letters"),
  birthday: z.date({
    required_error: "Birthday is required",
    invalid_type_error: "Invalid date format",
  }),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]+$/, "Phone number must be a valid format"),
  email: z.string().trim().email("Email must be a valid email address"),
});

export const clientFormMedicalSchema = z.object({
  allergic: z.string().trim(),
  chronicDiseases: z.string().trim(),
  takingMedication: z.string().trim(),
  skinDiseases: z.string().trim(),
});
