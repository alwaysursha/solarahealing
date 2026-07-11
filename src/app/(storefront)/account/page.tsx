import { Role } from "@prisma/client";
import { auth, signOut } from "@/auth";
import { InnerPage } from "@/components/storefront/InnerPage";
import { GlowButton } from "@/components/ui/GlowButton";
import { getOrdersForUser } from "@/lib/content";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in?callbackUrl=/account");
  }

  const orders = await getOrdersForUser(session.user.id);

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
          Book a session
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

      <section id="orders" className="mt-10 scroll-mt-28">
        <h2 className="font-serif text-2xl text-purple-deep">Past orders</h2>
        <p className="mt-2 text-sm text-purple-deep/60">Your course and workshop purchases appear here.</p>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-purple-deep/10 bg-white/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-purple-deep">Order {order.id.slice(0, 8)}…</p>
                  <p className="text-sm text-purple-deep/60">
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl text-purple-deep">${order.totalCad} CAD</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-purple-deep/45">{order.status}</p>
                </div>
              </div>
              <ul className="mt-3 space-y-1 text-sm text-purple-deep/70">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.title} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {orders.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-purple-deep/15 bg-cream/20 px-4 py-8 text-center text-sm text-purple-deep/55">
              No orders yet.{" "}
              <Link href="/checkout" className="font-medium text-gold hover:text-gold-light">
                Book a session
              </Link>{" "}
              to get started.
            </p>
          ) : null}
        </div>
      </section>
    </InnerPage>
  );
}
