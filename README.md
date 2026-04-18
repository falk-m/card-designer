# PostCard Editor

## install

- `npm install`: install dependencies

## development

- `npm start` run Webserver under http://localhost:8000
- `np run dev` start watcher to bunde js file on changes

## api

- `window.editor.exportImageFile(): Promise<File>`: return jpeg File object
- `window.editor.loadImages(imagesSrcs: { id: string, src: string, meta?: {} }[]) : Promise<void>`: load images from url or FileReader result
- `window.editor.removeImage(imageId: string)`: remove an image
- `window.editor.getImages()`: get list of images from editor with position details
- `window.editor.getLayout()`: get informations about the selected card Layout,
- `window.editor.selectLayout(layoutId: string)`: select a layout

## TODO

- add cutting border

## Readmap

- add layouts with text

## helpful links

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage