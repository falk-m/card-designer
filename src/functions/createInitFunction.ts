

import { EditorContext, Layout } from "../types";

  export const createInitFunction = (editorContext: EditorContext, layouts: Layout[]) => {
    return (layoutId?: string) => {
    console.log("INIT", { layoutId: layoutId });
    const countImages = editorContext.images.length;
    let layoutToUse: Layout | null = null;
    if (layoutId) {
      layoutToUse = layouts.find((l) => l.id === layoutId) ?? null;
    }
    layoutToUse = layoutToUse || layouts.find((l) => l.maxImages >= countImages) || layouts[0];
    editorContext.layout = layoutToUse;
    editorContext.canvas.width = layoutToUse.dimensions.width;
    editorContext.canvas.height = layoutToUse.dimensions.height;

    editorContext.ctx.clearRect(0, 0, editorContext.canvas.width, editorContext.canvas.height);

    editorContext.images.forEach((editorImage, index) => {
      if (index < layoutToUse.positions.length) {
        const layoutPosition = layoutToUse.positions[index];

        const imagePositipon = { x: 0, y: 0, width: editorImage.naturalWidth, height: editorImage.naturalHeight };

        editorImage.layoutPosition = layoutPosition;
        editorImage.imagePosition = imagePositipon;

        //calculate the best fit for the image in the given position while maintaining aspect ratio

        const layoutAspectRatio = layoutPosition.width / layoutPosition.height;
        if (editorImage.aspectRatio > layoutAspectRatio) {
          console.log("Image is wider than layout position");
          imagePositipon.height = editorImage.naturalHeight;
          imagePositipon.width = editorImage.naturalHeight * layoutAspectRatio;
          imagePositipon.x = (editorImage.naturalWidth - imagePositipon.width) / 2;
          imagePositipon.y = 0;
        } else {
          console.log("Image is taller than layout position");
          imagePositipon.width = editorImage.naturalWidth;
          imagePositipon.height = editorImage.naturalWidth / layoutAspectRatio;
          imagePositipon.width = editorImage.naturalWidth;
          imagePositipon.x = 0;
          imagePositipon.y = (editorImage.naturalHeight - imagePositipon.height) / 2;
        }
      } else {
        editorImage.layoutPosition = undefined;
        editorImage.imagePosition = undefined;
      }
    });
  };
  }   