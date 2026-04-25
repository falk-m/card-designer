import { EditorImage, InputImage } from "../types";

export const loadImagesFunction = (imagesSrcs: InputImage[]) => {
  return new Promise<EditorImage[]>((resolve, reject) => {
    let loadedCount = 0;
    const images: EditorImage[] = [];

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

      img.crossOrigin = 'Anonymous';
      img.src = imagesSrc.src;
    }
  });
};
