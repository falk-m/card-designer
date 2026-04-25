import createDrawFunction from "./functions/createDrawFunction";
import { loadImagesFunction } from "./functions/loadImagesFunction";
import initTouchHandler from "./functions/initTouchHandler";
import { layouts } from "./layouts";
import { Layout, EditorContext, InputImage } from "./types";
import { initScaleHandler } from "./functions/initScaleHandler";
import { createExportImageFileFunction } from "./functions/createExportImageFileFunction";
import { createInitFunction } from "./functions/createInitFunction";

const editor = (layout: Layout[], canvas: HTMLCanvasElement) => {
  const editorContext: EditorContext = {
    canvas: canvas,
    ctx: canvas.getContext("2d") as CanvasRenderingContext2D,
    layout: layout[0],
    images: [],
    withCuttingFrame: true,
    loopDraw: true,
  };

  initTouchHandler(editorContext);
  initScaleHandler(editorContext);
  const exportImageFile = createExportImageFileFunction(editorContext);
  const init = createInitFunction(editorContext, layout);
  const draw = createDrawFunction(editorContext);

  const loadImages = async (imagesSrcs: InputImage[]) => {
    const loadedImages = await loadImagesFunction(imagesSrcs);
    editorContext.images = editorContext.images.concat(loadedImages);
    console.log("Loaded images", { loadedImages, editorContext });
    init();
  };

  const removeImage = (imageId: string) => {
    editorContext.images = editorContext.images.filter((img) => img.id !== imageId);
    init();
  };

  //start canvas drawing loop
  draw();

  const selectLayout = (layoutId: string) => {
    const layoutToUse = layout.find((l) => l.id === layoutId);
    if (!layoutToUse) {
      throw new Error(`Layout with ID ${layoutId} not found`);
    }
    init(layoutId);
  }

  const reset = () => {
    editorContext.images = [];
  };

  return {
    reset,
    loadImages,
    removeImage,
    exportImageFile,
    selectLayout,
    getImages: () => editorContext.images,
    getLayout: () => editorContext.layout,
  };
};

(window as any).CollageEditor = (canvas: HTMLCanvasElement) => editor(layouts, canvas);
