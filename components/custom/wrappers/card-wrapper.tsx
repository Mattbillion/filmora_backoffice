/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { LoaderIcon } from "../icons";

interface CardWrapperProps {
  children: React.ReactNode;
  headerText: string;
  description?: string;
  footerText: string;
  form: any;
  onSubmit: (data: any) => void;
  isPending?: boolean;
  disabled?: boolean;
}

export const CardWrapper = ({
  children,
  headerText,
  description,
  onSubmit,
  form,
  footerText,
  isPending,
  disabled,
}: CardWrapperProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{headerText}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">{children}</CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || disabled}>
              {isPending && <LoaderIcon />}
              {footerText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
