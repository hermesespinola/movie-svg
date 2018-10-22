# Web-gl App
Create a webGL application, defines an orthogonal camera, scene and scene object classes to simplify
working with the webGL API. you can see an example of usage at `src/js/SolidTriangle.js` and ``src/js/main.js``

It makes use of [Babel](https://github.com/babel/babel-loader) and
[webgl-glsl-loader](https://github.com/grieve/webpack-glsl-loader) to compile JavaScript and GLSL
together into a final JavaScript module.

## Requirements
- npm/yarn

## Usage
The entry point is `src/js/main.js`

#### `npm run build`
Build a production version of `bundle.js` into `dist/`.

#### `npm run watch`
Watch files in `src/` for changes, recompile on change.

#### `npm run dev`
Run a development server at `http://localhost:8080/`. This also will watch & recompile on file changes.

## License
[CC-BY-4.0](https://creativecommons.org/licenses/by/4.0/)

## Attributions
[webpack-webgl-boilerplate](https://github.com/obsoke/webpack-webgl-boilerplate) from Dale Karp <dale@dale.io> (http://dale.io)
