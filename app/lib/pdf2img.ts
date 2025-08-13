export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let loadPromise: Promise<any> | null = null;

async function loadPdfJs(): Promise<any> {
  if (pdfjsLib) return pdfjsLib;
  if (loadPromise) return loadPromise;

  try {
    // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not typed
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
      lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      pdfjsLib = lib;
      return lib;
    });

    return loadPromise;
  } catch (err) {
    console.warn("Failed to load pdf.js:", err);
    return null;
  }
}

export async function convertPdfToImage(
  file: File
): Promise<PdfConversionResult> {
  try {
    const lib = await loadPdfJs();
    if (!lib) {
      return { imageUrl: "", file: null, error: "pdf.js not loaded" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await lib.getDocument({ data: arrayBuffer }).promise;

    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2 }); // reduce scale for faster conversion

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return { imageUrl: "", file: null, error: "No 2D canvas context" };
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    await page.render({ canvasContext: context, viewport }).promise;

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
            return;
          }

          const originalName = file.name.replace(/\.pdf$/i, "");
          const imageFile = new File([blob], `${originalName}.png`, {
            type: "image/png",
          });

          resolve({ imageUrl: URL.createObjectURL(blob), file: imageFile });
        },
        "image/png",
        1.0
      );
    });
  } catch (err: any) {
    console.warn("PDF to Image conversion failed:", err);
    // Instead of throwing, return null so your upload continues
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${err.message || err}`,
    };
  }
}
