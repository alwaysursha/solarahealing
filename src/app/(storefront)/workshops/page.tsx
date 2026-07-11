import Link from "next/link";
import { InnerPage } from "@/components/storefront/InnerPage";
import { formatCad, workshops, workshopsIntro } from "@/lib/site";

export const dynamic = "force-dynamic";

export default function WorkshopsPage() {
  return (
    <InnerPage
      title="Upcoming Workshops"
      description={workshopsIntro}
    >
      <ul className="space-y-5">
        {workshops.map((workshop) => (
          <li key={workshop.id}>
            <article className="rounded-2xl border border-purple-deep/10 bg-canvas p-6 transition-colors hover:border-gold/35">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-gold">
                    {workshop.badge} · {workshop.duration}
                  </p>
                  <h2 className="font-serif mt-2 text-2xl text-purple-deep">
                    {workshop.title}
                  </h2>
                  <p className="mt-1 text-sm text-purple-deep/50">{workshop.date}</p>
                </div>
                <p className="font-serif text-2xl text-gold">{formatCad(workshop.priceCad)}</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-purple-deep/65">
                {workshop.description}
              </p>
              <Link
                href={`#contact?workshop=${workshop.id}`}
                className="mt-5 inline-flex rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-light"
              >
                Register Now
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </InnerPage>
  );
}
