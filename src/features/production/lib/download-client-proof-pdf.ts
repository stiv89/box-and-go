const IVORY = "#fbf6ee";
const PDF_PAGE_WIDTH_PX = 794;
const PAGE_MARGIN_MM = 10;

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete) {
    return image.naturalWidth > 0
      ? Promise.resolve()
      : Promise.reject(new Error("A proof image loaded empty."));
  }
  return new Promise((resolve, reject) => {
    image.addEventListener(
      "load",
      () => {
        if (image.naturalWidth === 0) {
          reject(new Error("A proof image loaded empty."));
          return;
        }
        resolve();
      },
      { once: true },
    );
    image.addEventListener("error", () => reject(new Error("A proof image failed to load.")), {
      once: true,
    });
  });
}

function mountProofIframe(html: string): Promise<{ iframe: HTMLIFrameElement; target: HTMLElement }> {
  return new Promise((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("data-proof-pdf-frame", "");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.cssText = [
      "position:fixed",
      "left:-12000px",
      "top:0",
      `width:${PDF_PAGE_WIDTH_PX}px`,
      "height:2400px",
      "border:0",
      `background:${IVORY}`,
    ].join(";");

    let settled = false;
    const finish = (
      action: "resolve" | "reject",
      value: { iframe: HTMLIFrameElement; target: HTMLElement } | Error,
    ) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      if (action === "reject") {
        iframe.remove();
        reject(value as Error);
        return;
      }
      resolve(value as { iframe: HTMLIFrameElement; target: HTMLElement });
    };

    const timeoutId = window.setTimeout(() => {
      finish("reject", new Error("Could not assemble the proof for PDF."));
    }, 15000);

    iframe.addEventListener("load", () => {
      const doc = iframe.contentDocument;
      const target = doc?.querySelector(".bng-proof") as HTMLElement | null;
      if (!doc || !target) return;
      const extra = doc.createElement("style");
      extra.textContent = `
        html, body { margin: 0; background: ${IVORY} !important; }
        .bng-proof-print-hide { display: none !important; }
        .bng-proof { max-width: none !important; box-shadow: none !important; background: ${IVORY} !important; }
        .bng-proof .tray { overflow: visible; }
        .bng-proof img { background: transparent !important; }
      `;
      doc.head.appendChild(extra);
      iframe.style.height = `${Math.max(doc.documentElement.scrollHeight, target.scrollHeight) + 32}px`;
      finish("resolve", { iframe, target });
    });

    iframe.srcdoc = html;
    document.body.appendChild(iframe);
  });
}

export async function htmlDocumentToPdfBlob(html: string): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const { iframe, target } = await mountProofIframe(html);
  try {
    const images = [...target.querySelectorAll("img")];
    await Promise.all(images.map((image) => waitForImage(image)));

    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: IVORY,
      logging: false,
      imageTimeout: 20000,
      windowWidth: PDF_PAGE_WIDTH_PX,
      scrollX: 0,
      scrollY: 0,
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const usableWidth = pageWidth - PAGE_MARGIN_MM * 2;
    const usableHeight = pageHeight - PAGE_MARGIN_MM * 2;
    const imgWidth = usableWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/jpeg", 0.93);

    let heightLeft = imgHeight;
    let offsetY = PAGE_MARGIN_MM;

    const paintPage = () => {
      pdf.setFillColor(251, 246, 238);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.addImage(imgData, "JPEG", PAGE_MARGIN_MM, offsetY, imgWidth, imgHeight);
    };

    paintPage();
    heightLeft -= usableHeight;
    while (heightLeft > 0.5) {
      offsetY = PAGE_MARGIN_MM - (imgHeight - heightLeft);
      pdf.addPage();
      paintPage();
      heightLeft -= usableHeight;
    }

    return pdf.output("blob");
  } finally {
    iframe.remove();
  }
}

export function looksLikePdf(bytes: Uint8Array): boolean {
  return bytes.length >= 5 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;
}

export async function assertPdfBlob(blob: Blob): Promise<void> {
  const header = new Uint8Array(await blob.slice(0, 5).arrayBuffer());
  if (blob.size < 100 || !looksLikePdf(header)) {
    throw new Error("Export did not produce a PDF.");
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function downloadClientProofPdf(
  html: string,
  filename = "box-and-go-proof.pdf",
): Promise<void> {
  const blob = await htmlDocumentToPdfBlob(html);
  await assertPdfBlob(blob);
  downloadBlob(blob, filename);
}
