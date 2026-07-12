import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCustomerProfile } from "@/components/admin/customers/AdminCustomerProfile";
import { getCustomerProfile } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCustomerProfile(id);

  if (!customer) {
    notFound();
  }

  return (
    <AdminShell
      activePath="/admin/customers"
      title="Customer profile"
      description="Member details and complete past order history."
    >
      <AdminCustomerProfile customer={customer} />
    </AdminShell>
  );
}
