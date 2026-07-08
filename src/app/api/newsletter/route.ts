import { redirect } from "next/navigation";
import { subscribeToNewsletter } from "@/lib/actions/newsletter";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const result = await subscribeToNewsletter(email);
  if (!result.ok) {
    redirect("/?newsletter=error");
  }
  redirect("/?newsletter=success");
}
