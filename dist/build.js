"use strict";
(() => {
  // src/functions/createDrawFunction.ts
  function createDrawFunction(editorContext) {
    const draw = () => {
      editorContext.ctx.clearRect(0, 0, editorContext.canvas.width, editorContext.canvas.height);
      editorContext.images.forEach((editorImage) => {
        const pos = editorImage.layoutPosition;
        const imgPos = editorImage.imagePosition;
        if (!pos || !imgPos) {
          return;
        }
        editorContext.ctx.drawImage(editorImage.image, imgPos.x, imgPos.y, imgPos.width, imgPos.height, pos.x, pos.y, pos.width, pos.height);
      });
      requestAnimationFrame(draw);
    };
    return draw;
  }

  // src/functions/loadImagesFunction.ts
  var loadImagesFunction = (imagesSrcs) => {
    return new Promise((resolve, reject) => {
      let loadedCount = 0;
      const images = [];
      for (const imagesSrc of imagesSrcs) {
        const img = new Image();
        img.onload = () => {
          images.push({
            id: imagesSrc.id,
            meta: imagesSrc.meta,
            image: img,
            naturalHeight: img.naturalHeight,
            naturalWidth: img.naturalWidth,
            aspectRatio: img.naturalWidth / img.naturalHeight
          });
          loadedCount++;
          if (loadedCount === imagesSrcs.length) {
            resolve(images);
          }
        };
        img.onerror = () => {
          reject(new Error(`Failed to load image: ${imagesSrc.id}`));
        };
        img.src = imagesSrc.src;
      }
    });
  };

  // src/functions/initTouchHandler.ts
  function initTouchHandler(editorContext) {
    const clickEvent = {
      isClicked: false,
      startX: 0,
      startY: 0,
      selectedImage: null,
      startImageX: 0,
      startImageY: 0
    };
    const startClickHandler = (x, y) => {
      clickEvent.isClicked = true;
      clickEvent.startX = x;
      clickEvent.startY = y;
      for (const editorImage of editorContext.images) {
        const layoutPosition = editorImage.layoutPosition;
        const imgagePosition = editorImage.imagePosition;
        if (!layoutPosition || !imgagePosition) {
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
      console.log("clickstart", x, y);
    };
    const endClickHandler = (x, y) => {
      clickEvent.isClicked = false;
      clickEvent.selectedImage = null;
      console.log("clickend", x, y);
    };
    const moveClickHandler = (x, y) => {
      if (!clickEvent.isClicked || !clickEvent.selectedImage || !clickEvent.selectedImage.layoutPosition || !clickEvent.selectedImage.imagePosition) {
        return;
      }
      const offsetX = x - clickEvent.startX;
      const offsetY = y - clickEvent.startY;
      const imagePosition = clickEvent.selectedImage.imagePosition;
      const factor = clickEvent.selectedImage.image.naturalWidth / clickEvent.selectedImage.layoutPosition.width;
      imagePosition.y = clickEvent.startImageY - offsetY * factor;
      imagePosition.x = clickEvent.startImageX - offsetX * factor;
      if (imagePosition.y < 0) {
        imagePosition.y = 0;
      }
      if (imagePosition.x < 0) {
        imagePosition.x = 0;
      }
      if (clickEvent.selectedImage.image.naturalWidth - imagePosition.width - imagePosition.x < 0) {
        imagePosition.x = clickEvent.selectedImage.image.naturalWidth - imagePosition.width;
      }
      if (clickEvent.selectedImage.image.naturalHeight - imagePosition.height - imagePosition.y < 0) {
        imagePosition.y = clickEvent.selectedImage.image.naturalHeight - imagePosition.height;
      }
      console.log("clickmove", x, y, offsetX, offsetY);
    };
    const canvas = editorContext.canvas;
    canvas.addEventListener("mousemove", (e) => {
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
      if (event.touches.length !== 1) {
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
      if (event.touches.length !== 1) {
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
      if (!clickEvent.isClicked) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
      const x = (event.changedTouches[0].clientX - rect.left) / canvasScaleFacor;
      const y = (event.changedTouches[0].clientY - rect.top) / canvasScaleFacor;
      endClickHandler(x, y);
    });
  }

  // src/layouts.ts
  var portraitDimaensions = { width: 600, height: 800 };
  var landscapeDimaensions = { width: 800, height: 600 };
  var layouts = [
    {
      id: "portrait1",
      type: "portrait",
      maxImages: 1,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: 600, height: 800 }
      ]
    },
    {
      id: "portrait2",
      type: "portrait",
      maxImages: 2,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: 600, height: 400 },
        { x: 0, y: 400, width: 600, height: 400 }
      ]
    },
    {
      id: "portrait3",
      type: "portrait",
      maxImages: 3,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: 300, height: 400 },
        { x: 300, y: 0, width: 300, height: 400 },
        { x: 0, y: 400, width: 600, height: 400 }
      ]
    },
    {
      id: "portrait4",
      type: "portrait",
      maxImages: 4,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: 300, height: 400 },
        { x: 300, y: 0, width: 300, height: 400 },
        { x: 0, y: 400, width: 300, height: 400 },
        { x: 300, y: 400, width: 300, height: 400 }
      ]
    },
    {
      id: "landscape1",
      type: "landscape",
      maxImages: 1,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: 800, height: 600 }
      ]
    },
    {
      id: "landscape2",
      type: "landscape",
      maxImages: 2,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: 400, height: 600 },
        { x: 400, y: 0, width: 400, height: 600 }
      ]
    },
    {
      id: "landscape3",
      type: "landscape",
      maxImages: 3,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: 400, height: 300 },
        { x: 0, y: 300, width: 400, height: 300 },
        { x: 400, y: 0, width: 400, height: 600 }
      ]
    },
    {
      id: "landscape4",
      type: "landscape",
      maxImages: 4,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: 400, height: 300 },
        { x: 0, y: 300, width: 400, height: 300 },
        { x: 400, y: 0, width: 400, height: 300 },
        { x: 400, y: 300, width: 400, height: 300 }
      ]
    }
  ];

  // src/functions/initScaleHandler.ts
  var zoom = (editorImage, factor) => {
    const imgPos = editorImage.imagePosition;
    if (!imgPos) {
      return;
    }
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
  function initScaleHandler(editorContext) {
    const canvas = editorContext.canvas;
    const scaleFactor = 1.01;
    const handleWheel = (event) => {
      event.preventDefault();
      const { deltaY, clientX, clientY } = event;
      const zoomIn = deltaY < 0;
      const rect = canvas.getBoundingClientRect();
      const canvasScaleFacor = editorContext.canvas.offsetWidth / editorContext.canvas.width;
      const x = (clientX - rect.left) / canvasScaleFacor;
      const y = (clientY - rect.top) / canvasScaleFacor;
      const factor = zoomIn ? scaleFactor : 1 / scaleFactor;
      editorContext.images.forEach((editorImage) => {
        const layoutPos = editorImage.layoutPosition;
        if (!layoutPos) {
          return;
        }
        if (x >= layoutPos.x && x <= layoutPos.x + layoutPos.width && y >= layoutPos.y && y <= layoutPos.y + layoutPos.height) {
          zoom(editorImage, factor);
        }
      });
    };
    let lastTouchDistance = 0;
    let touchedImage = null;
    const handleTouchStart = (event) => {
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
        editorContext.images.forEach((editorImage) => {
          const layoutPos = editorImage.layoutPosition;
          if (!layoutPos) {
            return;
          }
          if (x1 >= layoutPos.x && x1 <= layoutPos.x + layoutPos.width && y1 >= layoutPos.y && y1 <= layoutPos.y + layoutPos.height || x2 >= layoutPos.x && x2 <= layoutPos.x + layoutPos.width && y2 >= layoutPos.y && y2 <= layoutPos.y + layoutPos.height) {
            touchedImage = editorImage;
          }
        });
        lastTouchDistance = Math.hypot(x2 - x1, y2 - y1);
      }
    };
    const handleTouchMove = (event) => {
      if (event.touches.length !== 2 || !touchedImage) {
        return;
      }
      event.preventDefault();
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
      zoom(touchedImage, factor);
    };
    canvas.addEventListener("wheel", handleWheel);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchmove", handleTouchMove);
    return {
      destroy() {
        editorContext.canvas.removeEventListener("wheel", handleWheel);
        editorContext.canvas.removeEventListener("touchstart", handleTouchStart);
        editorContext.canvas.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }

  // src/functions/createExportImageFileFunction.ts
  var createExportImageFileFunction = (editorContext) => {
    return (filename, quality = 0.92) => {
      return new Promise((resolve, reject) => {
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
          quality
        );
      });
    };
  };

  // src/functions/createInitFunction.ts
  var createInitFunction = (editorContext, layouts2) => {
    return (layoutId) => {
      console.log("INIT", { layoutId });
      const countImages = editorContext.images.length;
      let layoutToUse = null;
      if (layoutId) {
        layoutToUse = layouts2.find((l) => l.id === layoutId) ?? null;
      }
      layoutToUse = layoutToUse || layouts2.find((l) => l.maxImages >= countImages) || layouts2[0];
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
          editorImage.layoutPosition = void 0;
          editorImage.imagePosition = void 0;
        }
      });
    };
  };

  // src/index.ts
  var editor = (layout) => {
    const editorContext = {
      canvas: document.getElementById("canvas"),
      ctx: document.getElementById("canvas").getContext("2d"),
      layout: layout[0],
      images: []
    };
    initTouchHandler(editorContext);
    initScaleHandler(editorContext);
    const exportImageFile = createExportImageFileFunction(editorContext);
    const init = createInitFunction(editorContext, layout);
    const draw = createDrawFunction(editorContext);
    const loadImages = async (imagesSrcs) => {
      const loadedImages = await loadImagesFunction(imagesSrcs);
      editorContext.images = editorContext.images.concat(loadedImages);
      console.log("Loaded images", { loadedImages, editorContext });
      init();
    };
    const removeImage = (imageId) => {
      editorContext.images = editorContext.images.filter((img) => img.id !== imageId);
      init();
    };
    draw();
    const selectLayout = (layoutId) => {
      const layoutToUse = layout.find((l) => l.id === layoutId);
      if (!layoutToUse) {
        throw new Error(`Layout with ID ${layoutId} not found`);
      }
      init(layoutId);
    };
    return {
      loadImages,
      removeImage,
      exportImageFile,
      selectLayout,
      getImages: () => editorContext.images,
      getLayout: () => editorContext.layout
    };
  };
  window.editor = editor(layouts);
})();
