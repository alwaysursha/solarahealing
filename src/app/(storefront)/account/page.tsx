import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function AccountPage() {
  redirect("/auth/sign-in?callbackUrl=/account");
}
