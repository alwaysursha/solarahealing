import type { CourseMaterialDeck, CourseMaterialSlide } from "@/lib/admin/course-material";
import { clampDiscountPercent, formatSlidePrice } from "@/lib/pricing";
import { prisma } from "@/lib/prisma";

type PricingSlide = Extract<CourseMaterialSlide, { kind: "course-pricing" }>;
type PricingItem = PricingSlide["items"][number];

async function loadCatalogPricing() {
  const [courses, sessions] = await Promise.all([
    prisma.onlineCourse.findMany({
      select: {
        slug: true,
        priceCad: true,
        presentationDiscountPercent: true,
      },
    }),
    prisma.privateSession.findMany({
      select: {
        slug: true,
        priceCad: true,
        presentationDiscountPercent: true,
      },
    }),
  ]);

  return {
    courses: new Map(courses.map((course) => [course.slug, course])),
    sessions: new Map(sessions.map((session) => [session.slug, session])),
  };
}

function hydratePricingItem(
  item: PricingItem,
  catalog: Awaited<ReturnType<typeof loadCatalogPricing>>,
): PricingItem {
  const kind = item.catalogKind ?? "course";
  const row = item.catalogSlug
    ? kind === "private_session"
      ? catalog.sessions.get(item.catalogSlug)
      : catalog.courses.get(item.catalogSlug)
    : undefined;

  if (!row) {
    return {
      ...item,
      presentationDiscountPercent: clampDiscountPercent(item.presentationDiscountPercent ?? 50),
    };
  }

  return {
    ...item,
    price: formatSlidePrice(row.priceCad),
    presentationDiscountPercent: clampDiscountPercent(row.presentationDiscountPercent),
  };
}

function hydratePricingSlide(
  slide: PricingSlide,
  catalog: Awaited<ReturnType<typeof loadCatalogPricing>>,
): PricingSlide {
  const items = slide.items.map((item) => hydratePricingItem(item, catalog));
  const maxPresentation = items.reduce(
    (max, item) => Math.max(max, item.presentationDiscountPercent ?? 0),
    0,
  );

  return {
    ...slide,
    items,
    banner:
      maxPresentation > 0 ? `Upto ${maxPresentation}% off if you sign up today` : slide.banner,
  };
}

/** Live-wire course-pricing slides from admin catalog prices + presentation discounts. */
export async function hydrateCourseMaterialDeck(deck: CourseMaterialDeck): Promise<CourseMaterialDeck> {
  const needsPricing = deck.slides.some((slide) => slide.kind === "course-pricing");
  if (!needsPricing) return deck;

  try {
    const catalog = await loadCatalogPricing();
    return {
      ...deck,
      slides: deck.slides.map((slide) =>
        slide.kind === "course-pricing" ? hydratePricingSlide(slide, catalog) : slide,
      ),
    };
  } catch {
    return {
      ...deck,
      slides: deck.slides.map((slide) => {
        if (slide.kind !== "course-pricing") return slide;
        return {
          ...slide,
          items: slide.items.map((item) => ({
            ...item,
            presentationDiscountPercent: clampDiscountPercent(item.presentationDiscountPercent ?? 50),
          })),
        };
      }),
    };
  }
}
