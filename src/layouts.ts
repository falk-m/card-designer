import { Layout } from "./types";

const portraitDimaensions = { width: 600, height: 800 };
const landscapeDimaensions = { width: 800, height: 600 };

export const layouts : Layout[] = [
    {
        id: "portrait1",
        type: 'portrait',
        maxImages: 1,
        dimensions: portraitDimaensions,
        positions: [
            { x: 0, y: 0, width: 600, height: 800 }
        ]
    },
    {
        id: "portrait2",
        type: 'portrait',
        maxImages: 2,
        dimensions: portraitDimaensions,
        positions: [
            { x: 0, y: 0, width: 600, height: 400 },
            { x: 0, y: 400, width: 600, height: 400 }
        ]
    },
    {
        id: "portrait3",
        type: 'portrait',
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
        type: 'portrait',
        maxImages: 4,
        dimensions: portraitDimaensions,
        positions: [
            { x: 0, y: 0, width: 300, height: 400 },
            { x: 300, y: 0, width: 300, height: 400 },
            { x: 0, y: 400, width: 300, height: 400 },
            { x: 300, y: 400, width: 300, height: 400 },
        ]
    },
    {
        id: "landscape1",
        type: 'landscape',
        maxImages: 1,
        dimensions: landscapeDimaensions,
        positions: [
            { x: 0, y: 0, width: 800, height: 600 }
        ]
    },
    {
        id: "landscape2",
        type: 'landscape',
        maxImages: 2,
        dimensions: landscapeDimaensions,
        positions: [
            { x: 0, y: 0, width: 400, height: 600 },
            { x: 400, y: 0, width: 400, height: 600 }
        ]
    },
    {
        id: "landscape3",
        type: 'landscape',
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
        type: 'landscape',
        maxImages: 4,
        dimensions: landscapeDimaensions,
        positions: [
            { x: 0, y: 0, width: 400, height: 300 },
            { x: 0, y: 300, width: 400, height: 300 },
            { x: 400, y: 0, width: 400, height: 300 },
            { x: 400, y: 300, width: 400, height: 300 },
        ]
    },
];