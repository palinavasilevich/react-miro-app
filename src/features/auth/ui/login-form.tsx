import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Field, FieldError, FieldLabel } from "@/shared/ui/kit/field";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import { useLogin } from "../model/use-login";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email("Enter a valid email address")),

  password: z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isPending, errorMessage, login } = useLogin();

  const onSubmit = form.handleSubmit((data) => login(data));

  if (isPending) {
  }

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

      {errorMessage && (
        <p className="text-destructive text-sm">{errorMessage}</p>
      )}

      <Button type="submit" disabled={isPending} className="cursor-pointer">
        Login
      </Button>
    </form>
  );
}
