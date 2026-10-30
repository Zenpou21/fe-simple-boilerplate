import { z } from "zod";

/** Rules for the login form. zod checks them in the browser before anything is sent. */
export const loginSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
