export default async function ScheduleBuildPage({
  params,
}: {
  params: Promise<{ eventId: string; templateId: string }>;
}) {
  const { templateId, eventId } = await params;
  return (
    <div>
      template:{templateId}, event:{eventId}
    </div>
  );
}
