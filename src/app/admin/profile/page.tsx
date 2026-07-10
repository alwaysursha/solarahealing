import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db, users } from "@/db";
import { AdminField, AdminPanel, AdminShell, AdminSubmit } from "@/components/admin/AdminShell";
import { updateAdminPasswordAction, updateAdminProfileAction } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await auth();
  const rows = await db.select().from(users).where(eq(users.id, session!.user.id)).limit(1);
  const user = rows[0];

  return (
    <AdminShell
      activePath="/admin/profile"
      title="Admin Profile"
      description="Update your account details and password."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminPanel title="Profile">
          <form action={updateAdminProfileAction} className="space-y-4">
            <AdminField label="Name" name="name" defaultValue={user?.name ?? ""} />
            <p className="text-sm text-purple-deep/60">
              Email: <span className="font-medium text-purple-deep">{user?.email}</span>
            </p>
            <AdminField label="Phone" name="phone" defaultValue={user?.phone ?? ""} />
            <AdminSubmit label="Save profile" />
          </form>
          <p className="mt-4 text-xs text-purple-deep/45">Email changes require a separate verification flow.</p>
        </AdminPanel>

        <AdminPanel title="Password">
          <form action={updateAdminPasswordAction} className="space-y-4">
            <AdminField label="Current password" name="currentPassword" type="password" />
            <AdminField label="New password" name="newPassword" type="password" />
            <AdminSubmit label="Update password" />
          </form>
          {!user?.passwordHash ? (
            <p className="mt-4 text-sm text-purple-deep/60">
              You signed in with Google. Password login is not enabled for this account.
            </p>
          ) : null}
        </AdminPanel>
      </div>
    </AdminShell>
  );
}
