import { EditorContext, EditorImage } from "../types";

const zoom = (editorImage: EditorImage, factor: number) => {
  const imgPos = editorImage.imagePosition;
  const centerX = imgPos.x + imgPos.width / 2;
  const centerY = imgPos.y + imgPos.height / 2;

  const newWidth = imgPos.width * factor;
  const newHeight = imgPos.height * factor;
  const newX = centerX - (centerX - imgPos.x) * factor;
  const newY = centerY - (centerY - imgPos.y) * factor;

  if (newWidth + newX > editorImage.image.naturalWidth || newHeight + newY > editorImage.image.naturalHeight) {
    return;
  }

  imgPos.width = newWidth;
  imgPos.height = newHeight;
  imgPos.x = newX;
  imgPos.y = newY;
};

export function createScaleHandler(editorContext: EditorContext) {
  const canvas = editorContext.canvas;
  const scaleFactor = 1.01; // Adjust this value to control the zoom speed

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();

    const { deltaY, clientX, clientY } = event;
    const zoomIn = deltaY < 0;

    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x = (clientX - rect.left)  / canvasScaleFacor;
    const y = (clientY - rect.top) / canvasScaleFacor;

    const factor = zoomIn ? scaleFactor : 1 / scaleFactor;

    editorContext.usedImages.forEach((editorImage) => {
      const layoutPos = editorImage.layoutPosition;
      if (x >= layoutPos.x && x <= layoutPos.x + layoutPos.width && y >= layoutPos.y && y <= layoutPos.y + layoutPos.height) {
        zoom(editorImage, factor);
      }
    });
  };

  let lastTouchDistance = 0;
  let touchedImage: EditorImage | null = null;

  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 2) {
      event.preventDefault();

      const touch1 = event.touches[0];
      const touch2 = event.touches[1];
      const rect = canvas.getBoundingClientRect();
      const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
      const x1 = (touch1.clientX - rect.left) / canvasScaleFacor;
      const y1 = (touch1.clientY - rect.top) / canvasScaleFacor;
      const x2 = (touch2.clientX - rect.left) / canvasScaleFacor;
      const y2 = (touch2.clientY - rect.top) / canvasScaleFacor;

      touchedImage = null;
      editorContext.usedImages.forEach((editorImage) => {
        const layoutPos = editorImage.layoutPosition;
        if (
          (x1 >= layoutPos.x && x1 <= layoutPos.x + layoutPos.width && y1 >= layoutPos.y && y1 <= layoutPos.y + layoutPos.height) ||
          (x2 >= layoutPos.x && x2 <= layoutPos.x + layoutPos.width && y2 >= layoutPos.y && y2 <= layoutPos.y + layoutPos.height)
        ) {
          touchedImage = editorImage;
        }
      });

      lastTouchDistance = Math.hypot(x2 - x1, y2 - y1);
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 2 || !touchedImage) {
      return;
    }
    event.preventDefault();
    // Handle pinch move
    const touch1 = event.touches[0];
    const touch2 = event.touches[1];
    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x1 = (touch1.clientX - rect.left) / canvasScaleFacor;
    const y1 = (touch1.clientY - rect.top) / canvasScaleFacor;
    const x2 = (touch2.clientX - rect.left) / canvasScaleFacor;
    const y2 = (touch2.clientY - rect.top) / canvasScaleFacor;

    const currentDistance = Math.hypot(x2 - x1, y2 - y1);
    const factor = currentDistance / lastTouchDistance;
    lastTouchDistance = currentDistance;

    zoom(touchedImage, -1 * factor);
  };

  canvas.addEventListener("wheel", handleWheel);
  canvas.addEventListener("touchstart", handleTouchStart);
  canvas.addEventListener("touchmove", handleTouchMove);

  return {
    destroy() {
      editorContext.canvas.removeEventListener("wheel", handleWheel);
      editorContext.canvas.removeEventListener("touchstart", handleTouchStart);
      editorContext.canvas.removeEventListener("touchmove", handleTouchMove);
    },
  };
}
