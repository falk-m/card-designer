import { EditorContext } from "../types";

export default function createDrawFunction(editorContext: EditorContext) {
  const draw = () => {
    editorContext.ctx.clearRect(0, 0, editorContext.canvas.width, editorContext.canvas.height);
    editorContext.images.forEach((editorImage) => {
      const pos = editorImage.layoutPosition;
      const imgPos = editorImage.imagePosition;

      if(!pos || !imgPos) {
        return;
      }

      editorContext.ctx.drawImage(editorImage.image, imgPos.x, imgPos.y, imgPos.width, imgPos.height, pos.x, pos.y, pos.width, pos.height);
    });

    //draw cutting frame, without overlapping of frame edges
    if (editorContext.withCuttingFrame) {
      const frameWidth = editorContext.layout.dimensions.cuttingFrame;
      editorContext.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      editorContext.ctx.fillRect(frameWidth, 0, editorContext.layout.dimensions.width - 2 * frameWidth, frameWidth);
      editorContext.ctx.fillRect(frameWidth, editorContext.layout.dimensions.height - frameWidth, editorContext.layout.dimensions.width - 2 * frameWidth, frameWidth);
      editorContext.ctx.fillRect(0, 0, frameWidth, editorContext.layout.dimensions.height);
      editorContext.ctx.fillRect(editorContext.layout.dimensions.width - frameWidth, 0, frameWidth, editorContext.layout.dimensions.height);
    }

    //draw space between images
    if (editorContext.spaceBetweenImages) {
      editorContext.ctx.fillStyle = "rgba(255, 255, 255, 1)";
      const space = editorContext.spaceBetweenImages ?? 0;
      editorContext.layout.positions.forEach((pos) => {
        editorContext.ctx.fillRect(pos.x + pos.width, pos.y, space, pos.height);
        editorContext.ctx.fillRect(pos.x, pos.y + pos.height, pos.width + space, space);
      });
    }

    if (editorContext.loopDraw) {
      requestAnimationFrame(draw);
    }
  };

  return draw;
}
