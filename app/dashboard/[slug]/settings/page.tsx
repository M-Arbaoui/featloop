import db from '@/lib/db';
import SettingsForm from '@/components/dashboard/SettingsForm';
import { notFound } from 'next/navigation';

interface SettingsPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function SettingsPage({ params, searchParams }: SettingsPageProps) {
  const { slug } = await params;
  const { success } = await searchParams;

  const workspace = await db.workspace.findUnique({
    where: { slug },
  });

  if (!workspace) {
    notFound();
  }

  return (
    <div className="space-y-6">
      
      {/* Settings Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight">Workspace Settings</h1>
        <p className="text-sm text-zinc-400">
          Modify the name, public URL slug, or description of your workspace.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-950/50 border border-emerald-900 text-emerald-200 text-xs px-3 py-2 rounded-lg">
          {success}
        </div>
      )}

      {/* Settings Form Wrapper */}
      <SettingsForm
        workspaceId={workspace.id}
        initialName={workspace.name}
        initialSlug={workspace.slug}
        initialDescription={workspace.description}
      />

    </div>
  );
}
