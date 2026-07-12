"use client";

import dynamic from "next/dynamic";

const InvoiceActionsClient = dynamic(
  () => import("./InvoiceActionsClient").then((mod) => mod.InvoiceActionsClient),
  {
    ssr: false,
    loading: () => (
      <div className="invoice-toolbar no-print">
        <a href="/admin/orders" className="invoice-toolbar-back">
          ← Back to orders
        </a>
        <div className="invoice-toolbar-actions">
          <span className="invoice-toolbar-btn invoice-toolbar-btn-secondary" aria-hidden>
            Print
          </span>
          <span className="invoice-toolbar-btn invoice-toolbar-btn-primary" aria-hidden>
            Download PDF
          </span>
        </div>
      </div>
    ),
  },
);

export function InvoiceActions({
  orderId,
  invoiceRootId = "invoice-document",
}: {
  orderId: string;
  invoiceRootId?: string;
}) {
  return <InvoiceActionsClient orderId={orderId} invoiceRootId={invoiceRootId} />;
}

export function GenerateInvoiceButton({
  orderId,
  className = "",
}: {
  orderId: string;
  className?: string;
}) {
  return (
    <a
      href={`/admin/orders/${orderId}/invoice`}
      target="_blank"
      rel="noopener noreferrer"
      className={["admin-invoice-generate", className].filter(Boolean).join(" ")}
    >
      Generate Invoice
    </a>
  );
}
