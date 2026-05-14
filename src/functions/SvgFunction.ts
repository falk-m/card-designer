import { EditorContext } from "../types";

const SVG_TRANSFORMER_VERSION = "1.0";

export function exportAsSVG(editorContext: EditorContext): string {
  const svgParts: string[] = [];
  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${editorContext.layout.dimensions.width}" height="${editorContext.layout.dimensions.height}" data-svg-transformer-version="${SVG_TRANSFORMER_VERSION}">`);

  editorContext.images.forEach((editorImage) => {
    const pos = editorImage.layoutPosition;
    const imgPos = editorImage.imagePosition;

    if (!pos || !imgPos) {
      return;
    }

    //insert images as data URLs, to avoid CORS issues when importing the SVG back into the editor
    const canvas = document.createElement("canvas");
    canvas.width = imgPos.width;
    canvas.height = imgPos.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.drawImage(editorImage.image, imgPos.x, imgPos.y, imgPos.width, imgPos.height, 0, 0, imgPos.width, imgPos.height);
    const imageDataURL = canvas.toDataURL("image/png");

    //store original image src in SVG as data attribute, to allow for better quality when importing back, if the original image is still available at the src URL
    svgParts.push(`<image href="${imageDataURL}" x="${pos.x}" y="${pos.y}" width="${pos.width}" height="${pos.height}" 
      data-original-src="${editorImage.image.src}" />`);
  });

  svgParts.push(`</svg>`);
  return svgParts.join("");
}

export function importFromSVG(svgString: string, editorContext: EditorContext): Promise<void> {
  return new Promise((resolve, reject) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const imageElements = svgDoc.querySelectorAll("image");

    //get version from svg, if version not supported, reject with error
    const version = svgDoc.documentElement.getAttribute("data-svg-transformer-version");
    if (version && version != SVG_TRANSFORMER_VERSION) {
      reject(new Error(`SVG version ${version} is not supported. Please update the application.`));
      return;
    }

    if (imageElements.length === 0) {
      reject(new Error("No images found in SVG"));
      return;
    }

    editorContext.images = [];
    const loadImagePromises: Promise<void>[] = [];

    imageElements.forEach((imageElement, index) => {
      const src = imageElement.getAttribute("data-original-src");
      const x = parseFloat(imageElement.getAttribute("x") || "0");
      const y = parseFloat(imageElement.getAttribute("y") || "0");
      const width = parseFloat(imageElement.getAttribute("width") || "0");
      const height = parseFloat(imageElement.getAttribute("height") || "0");

      if (!src) {
        reject(new Error(`Image element at index ${index} is missing data-original-src attribute`));
        return;
      }

      const img = new Image();
      const loadPromise = new Promise<void>((res, rej) => {
        img.onload = () => {
          editorContext.images.push({
            id: `imported-${index}`,
            image: img,
            naturalHeight: img.naturalHeight,
            naturalWidth: img.naturalWidth,
            aspectRatio: img.naturalWidth / img.naturalHeight,
            layoutPosition: { x, y, width, height },
            imagePosition: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight },
          });
          res();
        };
        img.onerror = () => rej(new Error(`Failed to load image at index ${index}`));
      });

      img.crossOrigin = "Anonymous";
      img.src = src;
      loadImagePromises.push(loadPromise);
    });

    Promise.all(loadImagePromises)
      .then(() => resolve())
      .catch(reject);
  });
}
