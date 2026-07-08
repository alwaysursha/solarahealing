import { notFound } from "next/navigation";
import { InnerPage } from "@/components/storefront/InnerPage";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const POSTS: Record<string, { title: string; body: string }> = {
  "what-is-reiki": {
    title: "What is Reiki?",
    body: "Reiki is a gentle hands-on and distance healing practice that channels universal life energy to restore balance and peace.",
  },
  "chakra-balancing": {
    title: "Chakra balancing guide",
    body: "Each of the seven chakras governs an aspect of your physical, emotional, and spiritual wellbeing.",
  },
  "sacred-art-of-reiki": {
    title: "The Sacred Art of Reiki",
    body: "Discover how universal life energy has guided healers for centuries — and how you can begin channeling it today with intention and grace.",
  },
  "energy-healing-basics": {
    title: "Energy Healing",
    body: "Restore flow, release tension, and return to your natural state of balance through gentle Reiki practice.",
  },
  "mindful-nutrition": {
    title: "Mindful Living",
    body: "Nourish body and spirit with rituals that align your daily life with healing energy.",
  },
  transformation: {
    title: "Transformation",
    body: "Understand how Reiki supports deep personal change — releasing old patterns and opening space for renewal.",
  },
  "test-your-aura": {
    title: "Know Your Aura",
    body: "Learn to sense the energy field around you and what it reveals about your emotional and spiritual state.",
  },
  "chakra-wisdom": {
    title: "Chakra Wisdom",
    body: "A refined introduction to the seven energy centers and how to bring each one into harmonious balance.",
  },
  "distance-healing": {
    title: "Distance Healing",
    body: "Energy transcends space. Explore how remote Reiki sessions deliver profound results across any distance.",
  },
  "daily-practice": {
    title: "Daily Practice",
    body: "Simple morning and evening rituals to keep your energy clear, grounded, and aligned.",
  },
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <InnerPage title={post.title}>
      <article className="prose prose-purple max-w-none text-purple-deep/75">
        <p>{post.body}</p>
      </article>
    </InnerPage>
  );
}
