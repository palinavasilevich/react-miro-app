import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/kit/form";
import { Input } from "@/shared/ui/kit/input";
import { Button } from "@/shared/ui/kit/button";
import { useLogin } from "../model/use-login";

const loginSchema = z.object({
  email: z.string("Email is required").email("Invalid email"),
  password: z
    .string("Password is required")
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
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="admin@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {errorMessage && (
          <p className="text-destructive text-sm">{errorMessage}</p>
        )}

        <Button type="submit" disabled={isPending}>
          Login
        </Button>
      </form>
    </Form>
  );
}
