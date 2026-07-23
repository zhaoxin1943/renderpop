import { CreateWorkspace } from "@/components/generate/CreateWorkspace";

export default async function CreateSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  return <CreateWorkspace key={sessionId} sessionId={sessionId} />;
}
