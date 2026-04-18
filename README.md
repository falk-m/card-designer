# PostCard Editor

## install

- `npm install`: install dependencies

## development

- `npm start` run Webserver under http://localhost:8000
- `np run dev` start watcher to bunde js file on changes

## api

- `window.editor.exportImage(): Promise<File>`: return jpeg File object
- `window.editor.loadImages(imagesSrcs: { src: string; name: string }[]) : Promise<void>`: load images from url or FileReader result
- `window.editor.init()`: init editor with loaded images

## TODO

- click on empty area: open upload
- click on image: show details, change image
- add cutting border
- use canvas scale to use a higher resolution

## Readmap

- add layouts with text

## helpful links

- https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage