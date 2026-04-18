import { EditorContext } from "../types";

export const createExportImageFileFunction = (editorContext: EditorContext) => {
  return (filename: string, quality: number = 0.92): Promise<File> => {
    return new Promise<File>((resolve, reject) => {
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
        quality,
      );
    });
  };
};
