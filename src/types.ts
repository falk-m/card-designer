export interface Position {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface Layout {
    id: string;
    dimensions: {
        width: number;
        height: number;
    };
    type: 'portrait' | 'landscape';
    maxImages: number;
    positions: Position[];
}

export interface EditorContext {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    layout: Layout;
    uploadedImages: UploadImage[]
    usedImages: EditorImage[];
}

export interface UploadImage {
    image: HTMLImageElement;
    naturalHeight: number;
    naturalWidth: number;
    aspectRatio: number;
    name: string;
}

export interface EditorImage {
    image: UploadImage;
    layoutPosition: Position;
    imagePosition: Position;
}