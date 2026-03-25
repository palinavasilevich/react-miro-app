import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import { useRegister } from "../model/use-register";
import { Field, FieldError, FieldLabel } from "@/shared/ui/kit/field";
import { Loader } from "@/shared/ui/loader";

const registerSchema = z
  .object({
    email: z.string("Email is required").email("Invalid email"),
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords do not match",
  });

export function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, errorMessage, register } = useRegister();

  const onSubmit = form.handleSubmit((data) => register(data));

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              {...field}
              id="email"
              aria-invalid={fieldState.invalid}
              type="email"
              placeholder="admin@gmail.com"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              type="password"
              placeholder="********"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              {...field}
              id="confirmPassword"
              aria-invalid={fieldState.invalid}
              type="password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {errorMessage && (
        <p className="text-destructive text-sm">{errorMessage}</p>
      )}
      <Button type="submit" disabled={isPending} className="cursor-pointer">
        {isPending ? <Loader text="Sending..." /> : "Sign Up"}
      </Button>
    </form>
  );
}
