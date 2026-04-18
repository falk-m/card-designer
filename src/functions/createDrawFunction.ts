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

    requestAnimationFrame(draw);
  };

  return draw;
}
