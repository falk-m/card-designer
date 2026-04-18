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

    //draw cutting frame
    if (editorContext.withCuttingFrame) {
      editorContext.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      editorContext.ctx.fillRect(0, 0, editorContext.layout.dimensions.width, editorContext.layout.dimensions.cuttingFrame);
      editorContext.ctx.fillRect(0, editorContext.layout.dimensions.height - editorContext.layout.dimensions.cuttingFrame, editorContext.layout.dimensions.width, editorContext.layout.dimensions.cuttingFrame);
      editorContext.ctx.fillRect(0, 0, editorContext.layout.dimensions.cuttingFrame, editorContext.layout.dimensions.height);
      editorContext.ctx.fillRect(editorContext.layout.dimensions.width - editorContext.layout.dimensions.cuttingFrame, 0, editorContext.layout.dimensions.cuttingFrame, editorContext.layout.dimensions.height);
    }

    if (editorContext.loopDraw) {
      requestAnimationFrame(draw);
    }
  };

  return draw;
}
