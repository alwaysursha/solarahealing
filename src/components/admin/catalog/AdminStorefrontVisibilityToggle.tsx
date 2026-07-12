"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { updateStorefrontSectionVisibilityAction } from "@/lib/admin/actions";

type StorefrontSection = "courses" | "workshops";

const sectionCopy: Record<
  StorefrontSection,
  { title: string; visibleHint: string; hiddenHint: string; showConfirm: string; hideConfirm: string }
> = {
  courses: {
    title: "Courses section",
    visibleHint: "The courses section is live on the homepage.",
    hiddenHint: "The courses section is hidden from the homepage.",
    showConfirm: "Show the courses section on your homepage? Visitors will see your published course catalog.",
    hideConfirm: "Hide the courses section from your homepage? Your catalog stays in admin — only the public section is removed.",
  },
  workshops: {
    title: "Workshops section",
    visibleHint: "The workshops section is live on the homepage.",
    hiddenHint: "The workshops section is hidden from the homepage.",
    showConfirm: "Show the workshops section on your homepage? Visitors will see your scheduled live sessions.",
    hideConfirm: "Hide the workshops section from your homepage? Your schedule stays in admin — only the public section is removed.",
  },
};

export function AdminStorefrontVisibilityToggle({
  section,
  visible: initialVisible,
}: {
  section: StorefrontSection;
  visible: boolean;
}) {
  const router = useRouter();
  const copy = sectionCopy[section];
  const [visible, setVisible] = useState(initialVisible);
  const [pendingVisible, setPendingVisible] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setVisible(initialVisible);
  }, [initialVisible]);

  const requestToggle = () => {
    setPendingVisible(!visible);
  };

  const cancelToggle = () => {
    setPendingVisible(null);
  };

  const confirmToggle = () => {
    if (pendingVisible === null) return;
    const nextVisible = pendingVisible;
    setPendingVisible(null);

    startTransition(async () => {
      await updateStorefrontSectionVisibilityAction(section, nextVisible);
      setVisible(nextVisible);
      router.refresh();
    });
  };

  const showingConfirm = pendingVisible !== null;
  const confirmIsShow = pendingVisible === true;

  return (
    <>
      <section className="admin-storefront-visibility rounded-[1.25rem] p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="admin-storefront-visibility-eyebrow text-[0.62rem] font-semibold uppercase tracking-[0.28em]">
              Homepage visibility
            </p>
            <h4 className="admin-storefront-visibility-title mt-2 font-serif text-xl">{copy.title}</h4>
            <p className="admin-storefront-visibility-copy mt-1 text-sm">
              {visible ? copy.visibleHint : copy.hiddenHint}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={visible}
            aria-label={`${visible ? "Hide" : "Show"} ${copy.title} on website`}
            disabled={isPending}
            onClick={requestToggle}
            className={[
              "admin-storefront-visibility-switch relative inline-flex h-11 w-[4.5rem] shrink-0 items-center rounded-full border transition-colors",
              visible ? "admin-storefront-visibility-switch-on" : "admin-storefront-visibility-switch-off",
              isPending ? "opacity-70" : "",
            ].join(" ")}
          >
            <span
              className={[
                "admin-storefront-visibility-knob absolute top-1 left-1 h-9 w-9 rounded-full transition-transform duration-300",
                visible ? "translate-x-[1.55rem]" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>
      </section>

      <AdminConfirmDialog
        open={showingConfirm}
        eyebrow={confirmIsShow ? "Publish to website" : "Hide from website"}
        title={confirmIsShow ? `Show ${copy.title.toLowerCase()}?` : `Hide ${copy.title.toLowerCase()}?`}
        description={confirmIsShow ? copy.showConfirm : copy.hideConfirm}
        confirmLabel={confirmIsShow ? "Show on website" : "Hide from website"}
        pendingLabel="Saving…"
        isPending={isPending}
        onCancel={cancelToggle}
        onConfirm={confirmToggle}
      />
    </>
  );
}
