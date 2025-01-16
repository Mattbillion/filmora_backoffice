import { auth } from "@/app/(auth)/auth";
import { hasPagePermission, Role } from "@/lib/permission";
import { User } from "next-auth";
import { notFound } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const withPermission = hasPagePermission(
    (session?.user as User & { role: Role })?.role,
    "trainings.tasks"
  );

  if (withPermission) return children;
  return notFound();
}
