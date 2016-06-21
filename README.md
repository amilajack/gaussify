## Experimental Blur UI Library

## Goal: Cross-Browser Blurs
Browser support for native blurs is almost non-existent. This project uses canvas as a fallback for blurs and provides native blurs when possible.

## Getting started
```bash
git clone https://github.com/amilajack/gaussify.git && cd gaussify
npm i
npm start
open http://127.0.0.1:8080
```

## Comparision:
[https://codepen.io/dudleystorey/pen/mkgyl](https://codepen.io/dudleystorey/pen/mkgyl)

![Demo](https://raw.github.com/amilajack/gaussify/master/img/demo.png)

## Todo:
- [ ] Color detection and intelligence
- [ ] Autoprefixer support
- [ ] Add WebWorker support for offloading blur calculation, `Gaussify.background(..., driver: 'webworker')`
- [ ] Add WebGL and SVG blur filter support for better perf, ex. `Gaussify.background(..., driver: 'webgl')`

## Notes:
Using backdrop filter (Safari support only)
```css
.blur-bg {
    background-color: rgba(255, 255, 255, 0.65);
    -webkit-backdrop-filter: saturate(180%) blur(20px);
}
```
