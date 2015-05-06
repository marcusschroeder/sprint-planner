# Frontend build with Webpack and ES6

## TODOS:
  - [ ] Port existing components to ES6 and

## Setup

### How initial setup was done
The initial setup is currently inspired by this [blog-post](http://jmfurlott.com/tutorial-setting-up-a-single-page-react-web-app-with-react-router-and-webpack/). It provides the simplest setup for using react with [ES6](linkme) build with [Webpack](linkme).

1.  `npm init` in base directory.
2.  `npm install --save-dev react webpack react-router react-hot-loader webpack-dev-server babel-loader` to install dependencies
3.  `mkdir js css && touch index.html webpack.config.js` create base files and folders for setup

## Run project with Webpack

 - to build the project run `npm run build`
 - to start dev server with hot reload, do `npm start` and go http://localhost:8080/#/login



## Documentations

### EcmaScript 6 / Babel
- Babel transpiler https://babeljs.io/docs/learn-es6/

### React
- https://github.com/rackt/react-router/tree/master/docs/api
- https://github.com/rackt/react-router/blob/master/docs/guides/overview.md

### Webpack  
- http://webpack.github.io/docs/
- https://github.com/webpack/less-loader



##Tutorials
- https://github.com/christianalfoni/react-webpack-cookbook/wiki
- https://github.com/petehunt/webpack-howto
- [Modular Javascript, Addy Osmani](http://addyosmani.com/writing-modular-js/)
- http://gaearon.github.io/react-hot-loader/


## Notes

### Furter Webpack loaders that could be usefull
  - https://github.com/odysseyscience/react-router-proxy-loader
