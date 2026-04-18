import createDrawFunction from "./functions/createDrawFunction";
import { loadImagesFunction } from "./functions/loadImagesFunction";
import createTouchHandler from "./functions/createTouchHandler";
import { layouts } from "./layouts";
import { UploadImage, Layout, EditorImage, EditorContext } from "./types";
import { createScaleHandler } from "./functions/createScaleHandler";

const editor = (layout: Layout[]) => {
  const editorContext: EditorContext = {
    canvas: document.getElementById("canvas") as HTMLCanvasElement,
    ctx: (document.getElementById("canvas") as HTMLCanvasElement).getContext("2d") as CanvasRenderingContext2D,
    uploadedImages: [],
    layout: layout[0],
    usedImages: [],
  };

  const loadImages = async (imagesSrcs: { src: string; name: string }[]) => {
    const loadedImages = await loadImagesFunction(imagesSrcs);
    editorContext.uploadedImages = editorContext.uploadedImages.concat(loadedImages);
    console.log("Loaded images", { loadedImages, editorContext });
  };

  document.querySelectorAll("button[data-layout-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const layoutId = btn.getAttribute("data-layout-btn");
      if (!layoutId) {
        throw new Error("Layout ID not found on button");
      }
      init(layoutId);
    });
  });

  const init = (layoutId?: string) => {
    console.log("INIT", { layoutId: layoutId });
    const countImages = editorContext.uploadedImages.length;
    let layoutToUse: Layout | null = null;
    if (layoutId) {
      layoutToUse = layout.find((l) => l.id === layoutId) ?? null;
    }
    layoutToUse = layoutToUse || layout.find((l) => l.maxImages >= countImages) || layout[0];
    editorContext.layout = layoutToUse;
    editorContext.canvas.width = layoutToUse.dimensions.width;
    editorContext.canvas.height = layoutToUse.dimensions.height;

    editorContext.ctx.clearRect(0, 0, editorContext.canvas.width, editorContext.canvas.height);

    editorContext.usedImages = [];

    editorContext.uploadedImages.forEach((img, index) => {
      if (index < layoutToUse.positions.length) {
        const pos = layoutToUse.positions[index];

        const imagePositipon = { x: 0, y: 0, width: img.image.naturalWidth, height: img.image.naturalHeight };

        const editorImage: EditorImage = {
          image: img,
          layoutPosition: pos,
          imagePosition: imagePositipon,
        };

        //calculate the best fit for the image in the given position while maintaining aspect ratio

        const layoutAspectRatio = pos.width / pos.height;
        if (img.aspectRatio > layoutAspectRatio) {
          console.log("Image is wider than layout position");
          imagePositipon.height = editorImage.image.naturalHeight;
          imagePositipon.width = editorImage.image.naturalHeight * layoutAspectRatio;
          imagePositipon.x = (editorImage.image.naturalWidth - imagePositipon.width) / 2;
          imagePositipon.y = 0;
        } else {
          console.log("Image is taller than layout position");
          imagePositipon.width = editorImage.image.naturalWidth;
          imagePositipon.height = editorImage.image.naturalWidth / layoutAspectRatio;
          imagePositipon.width = editorImage.image.naturalWidth;
          imagePositipon.x = 0;
          imagePositipon.y = (editorImage.image.naturalHeight - imagePositipon.height) / 2;
        }

        editorContext.usedImages.push(editorImage);
      }
    });
  };

  createDrawFunction(editorContext);
  createTouchHandler(editorContext);
  createScaleHandler(editorContext);

  const exportImage = async (filename: string = "card.jpg", quality: number = 0.92) => {
    return new Promise<File>((resolve, reject) => {
      editorContext.canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to create blob"));
            return;
          }

          const file = new File([blob], filename, { type: "image/jpeg" });
          resolve(file);
        },
        "image/jpeg",
        quality,
      );
    });
  };

  return {
    loadImages,
    init,
    exportImage,
  };
};

(window as any).editor = editor(layouts);
