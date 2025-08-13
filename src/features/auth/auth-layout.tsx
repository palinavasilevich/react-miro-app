import type { ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui/kit/card";

type Props = {
  children: ReactNode;
  title: ReactNode;
  description: ReactNode;
  footerText: ReactNode;
};

export function AuthLayout({
  children,
  title,
  description,
  footerText,
}: Props) {
  return (
    <main className="grow flex flex-col pt-[200px] items-center">
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground [&_a]:underline [&_a]:text-primary">
            {footerText}
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
