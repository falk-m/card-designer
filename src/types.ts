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
    images: EditorImage[];
}

export interface InputImage {
    src: string;
    id: string;
    meta?: any;
}

export interface EditorImage {
    id: string;
    meta?: any;
    image: HTMLImageElement;
    naturalHeight: number;
    naturalWidth: number;
    aspectRatio: number;
    layoutPosition?: Position;
    imagePosition?: Position;
}