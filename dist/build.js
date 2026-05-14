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
      if (editorContext.withCuttingFrame) {
        const frameWidth = editorContext.layout.dimensions.cuttingFrame;
        editorContext.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        editorContext.ctx.fillRect(frameWidth, 0, editorContext.layout.dimensions.width - 2 * frameWidth, frameWidth);
        editorContext.ctx.fillRect(frameWidth, editorContext.layout.dimensions.height - frameWidth, editorContext.layout.dimensions.width - 2 * frameWidth, frameWidth);
        editorContext.ctx.fillRect(0, 0, frameWidth, editorContext.layout.dimensions.height);
        editorContext.ctx.fillRect(editorContext.layout.dimensions.width - frameWidth, 0, frameWidth, editorContext.layout.dimensions.height);
      }
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
        img.crossOrigin = "Anonymous";
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
    };
    const endClickHandler = (x, y) => {
      clickEvent.isClicked = false;
      clickEvent.selectedImage = null;
    };
    const moveClickHandler = (x, y) => {
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
  var longSide = 1748;
  var shortSide = 1240;
  var portraitDimaensions = { width: shortSide, height: longSide, cuttingFrame: 35 };
  var landscapeDimaensions = { width: longSide, height: shortSide, cuttingFrame: 35 };
  var layouts = [
    {
      id: "portrait1",
      type: "portrait",
      maxImages: 1,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: shortSide, height: longSide }
      ]
    },
    {
      id: "portrait2",
      type: "portrait",
      maxImages: 2,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: shortSide, height: longSide / 2 },
        { x: 0, y: longSide / 2, width: shortSide, height: longSide / 2 }
      ]
    },
    {
      id: "portrait3",
      type: "portrait",
      maxImages: 3,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: shortSide / 2, height: longSide / 2 },
        { x: shortSide / 2, y: 0, width: shortSide / 2, height: longSide / 2 },
        { x: 0, y: longSide / 2, width: shortSide, height: longSide / 2 }
      ]
    },
    {
      id: "portrait4",
      type: "portrait",
      maxImages: 4,
      dimensions: portraitDimaensions,
      positions: [
        { x: 0, y: 0, width: shortSide / 2, height: longSide / 2 },
        { x: shortSide / 2, y: 0, width: shortSide / 2, height: longSide / 2 },
        { x: 0, y: longSide / 2, width: shortSide / 2, height: longSide / 2 },
        { x: shortSide / 2, y: longSide / 2, width: shortSide / 2, height: longSide / 2 }
      ]
    },
    {
      id: "landscape1",
      type: "landscape",
      maxImages: 1,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: longSide, height: shortSide }
      ]
    },
    {
      id: "landscape2",
      type: "landscape",
      maxImages: 2,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: longSide / 2, height: shortSide },
        { x: longSide / 2, y: 0, width: longSide / 2, height: shortSide }
      ]
    },
    {
      id: "landscape3",
      type: "landscape",
      maxImages: 3,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: longSide / 2, height: shortSide / 2 },
        { x: 0, y: shortSide / 2, width: longSide / 2, height: shortSide / 2 },
        { x: longSide / 2, y: 0, width: longSide / 2, height: shortSide }
      ]
    },
    {
      id: "landscape4",
      type: "landscape",
      maxImages: 4,
      dimensions: landscapeDimaensions,
      positions: [
        { x: 0, y: 0, width: longSide / 2, height: shortSide / 2 },
        { x: 0, y: shortSide / 2, width: longSide / 2, height: shortSide / 2 },
        { x: longSide / 2, y: 0, width: longSide / 2, height: shortSide / 2 },
        { x: longSide / 2, y: shortSide / 2, width: longSide / 2, height: shortSide / 2 }
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

  // src/functions/SvgFunction.ts
  var SVG_TRANSFORMER_VERSION = "1.0";
  function exportAsSVG(editorContext) {
    const svgParts = [];
    svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${editorContext.layout.dimensions.width}" height="${editorContext.layout.dimensions.height}" data-svg-transformer-version="${SVG_TRANSFORMER_VERSION}">`);
    editorContext.images.forEach((editorImage) => {
      const pos = editorImage.layoutPosition;
      const imgPos = editorImage.imagePosition;
      if (!pos || !imgPos) {
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = imgPos.width;
      canvas.height = imgPos.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.drawImage(editorImage.image, imgPos.x, imgPos.y, imgPos.width, imgPos.height, 0, 0, imgPos.width, imgPos.height);
      const imageDataURL = canvas.toDataURL("image/png");
      svgParts.push(`<image href="${imageDataURL}" x="${pos.x}" y="${pos.y}" width="${pos.width}" height="${pos.height}" 
      data-original-src="${editorImage.image.src}" />`);
    });
    if (editorContext.spaceBetweenImages) {
      const fillStyle = "rgba(255, 255, 255, 1)";
      const space = editorContext.spaceBetweenImages ?? 0;
      editorContext.layout.positions.forEach((pos) => {
        svgParts.push(`<rect x="${pos.x + pos.width}" y="${pos.y}" width="${space}" height="${pos.height}" fill="${fillStyle}" />`);
        svgParts.push(`<rect x="${pos.x}" y="${pos.y + pos.height}" width="${pos.width + space}" height="${space}" fill="${fillStyle}" />`);
      });
    }
    svgParts.push(`</svg>`);
    return svgParts.join("");
  }
  function importFromSVG(svgString, editorContext) {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
      const imageElements = svgDoc.querySelectorAll("image");
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
      const loadImagePromises = [];
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
        const loadPromise = new Promise((res, rej) => {
          img.onload = () => {
            editorContext.images.push({
              id: `imported-${index}`,
              image: img,
              naturalHeight: img.naturalHeight,
              naturalWidth: img.naturalWidth,
              aspectRatio: img.naturalWidth / img.naturalHeight,
              layoutPosition: { x, y, width, height },
              imagePosition: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight }
            });
            res();
          };
          img.onerror = () => rej(new Error(`Failed to load image at index ${index}`));
        });
        img.crossOrigin = "Anonymous";
        img.src = src;
        loadImagePromises.push(loadPromise);
      });
      Promise.all(loadImagePromises).then(() => resolve()).catch(reject);
    });
  }

  // src/index.ts
  var editor = (layout, canvas) => {
    const editorContext = {
      canvas,
      ctx: canvas.getContext("2d"),
      layout: layout[0],
      images: [],
      withCuttingFrame: true,
      spaceBetweenImages: 20,
      loopDraw: true
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
      getSvg: () => {
        return exportAsSVG(editorContext);
      },
      importSvg: async (svgString) => {
        await importFromSVG(svgString, editorContext);
        init();
      }
    };
  };
  window.CollageEditor = (canvas) => editor(layouts, canvas);
})();
