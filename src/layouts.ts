import { Layout } from "./types";
const longSide = 1748;
const shortSide = 1240;
const portraitDimaensions = { width: shortSide, height: longSide, cuttingFrame: 35 };
const landscapeDimaensions = { width: longSide, height: shortSide, cuttingFrame: 35 };

export const layouts : Layout[] = [
    {
        id: "portrait1",
        type: 'portrait',
        maxImages: 1,
        dimensions: portraitDimaensions,
        positions: [
            { x: 0, y: 0, width: shortSide, height: longSide }
        ]
    },
    {
        id: "portrait2",
        type: 'portrait',
        maxImages: 2,
        dimensions: portraitDimaensions,
        positions: [
            { x: 0, y: 0, width: shortSide, height: longSide / 2 },
            { x: 0, y: longSide / 2, width: shortSide, height: longSide / 2 }
        ]
    },
    {
        id: "portrait3",
        type: 'portrait',
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
        type: 'portrait',
        maxImages: 4,
        dimensions: portraitDimaensions,
        positions: [
            { x: 0, y: 0, width: shortSide / 2, height: longSide / 2 },
            { x: shortSide / 2, y: 0, width: shortSide / 2, height: longSide / 2 },
            { x: 0, y: longSide / 2, width: shortSide / 2, height: longSide / 2 },
            { x: shortSide / 2, y: longSide / 2, width: shortSide / 2, height: longSide / 2 },
        ]
    },
    {
        id: "landscape1",
        type: 'landscape',
        maxImages: 1,
        dimensions: landscapeDimaensions,
        positions: [
            { x: 0, y: 0, width: longSide, height: shortSide }
        ]
    },
    {
        id: "landscape2",
        type: 'landscape',
        maxImages: 2,
        dimensions: landscapeDimaensions,
        positions: [
            { x: 0, y: 0, width: longSide / 2, height: shortSide },
            { x: longSide / 2, y: 0, width: longSide / 2, height: shortSide }
        ]
    },
    {
        id: "landscape3",
        type: 'landscape',
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
        type: 'landscape',
        maxImages: 4,
        dimensions: landscapeDimaensions,
        positions: [
            { x: 0, y: 0, width: longSide / 2, height: shortSide / 2 },
            { x: 0, y: shortSide / 2, width: longSide / 2, height: shortSide / 2 },
            { x: longSide / 2, y: 0, width: longSide / 2, height: shortSide / 2 },
            { x: longSide / 2, y: shortSide / 2, width: longSide / 2, height: shortSide / 2 },
        ]
    },
];