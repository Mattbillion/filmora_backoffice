/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function AuthForm({
  action,
  children,
  defaultEmail = "",
}: {
  action: any;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="username"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Username
        </Label>

        <Input
          id="username"
          name="username"
          className="bg-muted text-md md:text-sm"
          type="text"
          placeholder="Username"
          autoComplete="username"
          required
          defaultValue={defaultEmail}
        />

        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          placeholder="Password"
          required
        />
      </div>

      {children}
    </form>
  );
}
