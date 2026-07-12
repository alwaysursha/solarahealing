"use client";

import { useCallback, useState } from "react";

export function InvoiceActionsClient({
  orderId,
  invoiceRootId = "invoice-document",
}: {
  orderId: string;
  invoiceRootId?: string;
}) {
  const [busy, setBusy] = useState<"pdf" | "print" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePrint = useCallback(() => {
    setError(null);
    setBusy("print");
    window.setTimeout(() => {
      window.print();
      setBusy(null);
    }, 50);
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    setError(null);
    setBusy("pdf");
    try {
      const root = document.getElementById(invoiceRootId);
      if (!root) {
        throw new Error("Invoice document not found.");
      }

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(root, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`soulara-invoice-${orderId.slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("[invoice] PDF generation failed", err);
      setError("Could not generate PDF. You can still use Print.");
    } finally {
      setBusy(null);
    }
  }, [invoiceRootId, orderId]);

  return (
    <div className="invoice-toolbar no-print">
      <a href="/admin/orders" className="invoice-toolbar-back">
        ← Back to orders
      </a>
      <div className="invoice-toolbar-actions">
        <button
          type="button"
          className="invoice-toolbar-btn invoice-toolbar-btn-secondary"
          onClick={handlePrint}
          disabled={busy !== null}
        >
          {busy === "print" ? "Opening…" : "Print"}
        </button>
        <button
          type="button"
          className="invoice-toolbar-btn invoice-toolbar-btn-primary"
          onClick={() => void handleDownloadPdf()}
          disabled={busy !== null}
        >
          {busy === "pdf" ? "Generating PDF…" : "Download PDF"}
        </button>
      </div>
      {error ? (
        <p className="invoice-toolbar-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
