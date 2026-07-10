import { Role } from "@prisma/client";
import { auth, signOut } from "@/auth";
import { InnerPage } from "@/components/storefront/InnerPage";
import { GlowButton } from "@/components/ui/GlowButton";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  return (
    <InnerPage title="Your account" description="Manage your profile, bookings, and orders.">
      <div className="rounded-2xl border border-purple-deep/10 bg-cream/40 p-6">
        <p className="text-sm text-purple-deep/60">Signed in as</p>
        <p className="mt-1 font-serif text-2xl text-purple-deep">{session.user.name}</p>
        <p className="text-sm text-purple-deep/70">{session.user.email}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-purple-deep/45">{session.user.role}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {session.user.role === Role.ADMIN ? (
          <GlowButton href="/admin" variant="primary">
            Open admin dashboard
          </GlowButton>
        ) : null}
        <GlowButton href="/checkout" variant="outline">
          View checkout
        </GlowButton>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="rounded-full border border-purple-deep/15 px-5 py-2.5 text-sm font-medium text-purple-deep"
          >
            Sign out
          </button>
        </form>
        <Link href="/" className="self-center text-sm text-purple-deep/60 hover:text-purple-deep">
          Back home
        </Link>
      </div>
    </InnerPage>
  );
}
