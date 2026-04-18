import { EditorContext, EditorImage } from "../types";

interface ClickEvent {
  isClicked: boolean;
  startX: number;
  startY: number;
  selectedImage: EditorImage | null;
  startImageX: number;
  startImageY: number;
}

export default function initTouchHandler(editorContext: EditorContext) {
  const clickEvent: ClickEvent = {
    isClicked: false,
    startX: 0,
    startY: 0,
    selectedImage: null,
    startImageX: 0,
    startImageY: 0,
  };

  const startClickHandler = (x: number, y: number) => {
    clickEvent.isClicked = true;
    clickEvent.startX = x;
    clickEvent.startY = y;

    for (const editorImage of editorContext.images) {
      const layoutPosition = editorImage.layoutPosition;
      const imgagePosition = editorImage.imagePosition;

      if(!layoutPosition || !imgagePosition) {
        continue;
      }
      if (x >= layoutPosition.x && x <= layoutPosition.x + layoutPosition.width && y >= layoutPosition.y && y <= layoutPosition.y + layoutPosition.height) {
        clickEvent.selectedImage = editorImage;
        clickEvent.startImageX = imgagePosition.x;
        clickEvent.startImageY = imgagePosition.y;
        break;
      }
    }

    if (!clickEvent.selectedImage) {
      clickEvent.isClicked = false;
    }

    //console.log("clickstart", x, y);
  };

  const endClickHandler = (x: number, y: number) => {
    clickEvent.isClicked = false;
    clickEvent.selectedImage = null;

    //console.log("clickend", x, y);
  };

  const moveClickHandler = (x: number, y: number) => {
    if (!clickEvent.isClicked || !clickEvent.selectedImage || !clickEvent.selectedImage.layoutPosition || !clickEvent.selectedImage.imagePosition) {
      return;
    }

    const offsetX = x - clickEvent.startX;
    const offsetY = y - clickEvent.startY;
    const imagePosition = clickEvent.selectedImage.imagePosition;

    const factor = imagePosition.width / clickEvent.selectedImage.layoutPosition.width;

    imagePosition.y = clickEvent.startImageY - offsetY * factor;
    imagePosition.x = clickEvent.startImageX - offsetX * factor;

    if (imagePosition.y < 0) {
      imagePosition.y = 0;
    }
    if (imagePosition.x < 0) {
      imagePosition.x = 0;
    }

    if (clickEvent.selectedImage.naturalWidth - imagePosition.width - imagePosition.x < 0) {
      imagePosition.x = clickEvent.selectedImage.naturalWidth - imagePosition.width;
    }
    if (clickEvent.selectedImage.naturalHeight - imagePosition.height - imagePosition.y < 0) {
      imagePosition.y = clickEvent.selectedImage.naturalHeight - imagePosition.height;
    }

    //console.log("clickmove", x, y, offsetX, offsetY);
  };

  const canvas = editorContext.canvas;

  canvas.addEventListener("mousemove", (e) => {
    if (!clickEvent.isClicked) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x = (e.clientX - rect.left) / canvasScaleFacor;
    const y = (e.clientY - rect.top) / canvasScaleFacor;

    moveClickHandler(x, y);
  });
  canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x = (e.clientX - rect.left) / canvasScaleFacor;
    const y = (e.clientY - rect.top) / canvasScaleFacor;

    startClickHandler(x, y);
  });

  canvas.addEventListener("mouseup", (e) => {
    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x = (e.clientX - rect.left) / canvasScaleFacor;
    const y = (e.clientY - rect.top) / canvasScaleFacor;

    endClickHandler(x, y);
  });

  canvas.addEventListener("touchstart", (event) => {
    if(event.touches.length !== 1) {
      return;
    }
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x = (touch.clientX - rect.left) / canvasScaleFacor;
    const y = (touch.clientY - rect.top) / canvasScaleFacor;

    startClickHandler(x, y);
  });

  canvas.addEventListener("touchmove", (event) => {
    if(event.touches.length !== 1) {
      return;
    }
    event.preventDefault();
    const touch = event.touches[0];
    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x = (touch.clientX - rect.left) / canvasScaleFacor;
    const y = (touch.clientY - rect.top) / canvasScaleFacor;

    moveClickHandler(x, y);
  });

  canvas.addEventListener("touchend", (event) => {
    if(!clickEvent.isClicked) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
    const x = (event.changedTouches[0].clientX - rect.left) / canvasScaleFacor;
    const y = (event.changedTouches[0].clientY - rect.top) / canvasScaleFacor;

    endClickHandler(x, y);
  });
}
