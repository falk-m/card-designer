# PostCard Editor

## install

- `npm install`: install dependencies

## development

- `npm start` run Webserver under http://localhost:8000
- `npm run dev` start watcher to bunde js file on changes

## api
- `const editor = window.CollageEditor(document.getElementById("canvas"));` create a editor
- `editor.exportImageFile(): Promise<File>`: return jpeg File object
- `editor.loadImages(imagesSrcs: { id: string, src: string, meta?: {} }[]) : Promise<void>`: load images from url or FileReader result
- `editor.removeImage(imageId: string)`: remove an image
- `editor.getImages()`: get list of images from editor with position details
- `editor.getLayout()`: get informations about the selected card Layout,
- `editor.selectLayout(layoutId: string)`: select a layout

## TODO

- add cutting border

## Readmap

- add layouts with text

## helpful links

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage