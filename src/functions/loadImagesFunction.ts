import { UploadImage } from "../types";

export const loadImagesFunction = (imagesSrcs: { src: string; name: string }[]) => {
  return new Promise<UploadImage[]>((resolve, reject) => {
    let loadedCount = 0;
    const images: UploadImage[] = [];

    for (const imagesSrc of imagesSrcs) {
      const img = new Image();
      img.onload = () => {
        images.push({
          image: img,
          naturalHeight: img.naturalHeight,
          naturalWidth: img.naturalWidth,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          name: imagesSrc.name,
        });

        loadedCount++;

        if (loadedCount === imagesSrcs.length) {
          resolve(images);
        }
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${imagesSrc.name}`));
      };

      img.src = imagesSrc.src;
    }
  });
};
