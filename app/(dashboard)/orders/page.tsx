import { Suspense } from "react";
import ReportClientPage from "./client";

export default async function Report() {
  return (
    <Suspense fallback="Loading...">
      <ReportClientPage />
    </Suspense>
  );
}
