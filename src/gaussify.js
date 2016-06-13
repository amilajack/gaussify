import 'context-blender';
import StackBlur from 'stackblur-canvas';

const cache = {};

/**
 * @todo: Add an event listener on the element, not on window
 *
 * @return {promise}
 */
export function background(element, imageSource, radius = 0) {
  if (!window.some) {
    window.some = _downsizeImage(_resolveElement(imageSource));
  }

  return new Promise((resolve) => {
    const downsizedImageUri = _blur(window.some, radius);
    resolve(_setBackground(_resolveElement(element), downsizedImageUri));
  });
}

// function _resolveCache() {}

// function _cache(value, ...params) {
//   cache[`${params}`] = value;
// }

function _blur(imageSource, blurRadius) {
  // Temporarily create offscreen image
  const downsizedImage = new Image();
  downsizedImage.src = imageSource;
  downsizedImage.id = 'downsizedImage';
  document.body.appendChild(downsizedImage);

  StackBlur.image('downsizedImage', 'canvas', blurRadius);

  // Get the image uri of downsized image
  const bluredImageCanvas = _resolveElement('canvas');
  const dataUrl = bluredImageCanvas.toDataURL();
  // bluredImageCanvas.remove();

  return dataUrl;
}

/**
 * @todo: requestAnimationFrame support
 * @todo: calculate if image is worth downsizing
 *
 * @param  {string} imgElement        | <img> element
 * @param  {number} targetWidth       | image source or image element
 * @param  {number} targetHeight      | image source or image element
 * @return {string} downsizedImageUri
 */
export function _downsizeImage(imgElement, targetWidth = 200, targetHeight = 200) {
  start('_downsizeImage');

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = imgElement;

  if (process.env.NODE_ENV !== 'production') {
    console.log('Downsizing from:');
    console.log({ width, height });
    console.log('to:');
    console.log({ targetWidth, targetHeight });
  }

  // Downsize
  ctx.drawImage(imgElement, 0, 0, targetWidth, targetHeight);
  const downsizedImageUri = canvas.toDataURL();
  // canvas.remove();

  end('_downsizeImage');

  return downsizedImageUri;
}

function _resolveElement(element) {
  if (typeof element === 'string') return document.querySelector(element);
  if (element instanceof Node) return element;

  throw new Error('Unexpected image type');
}

function _setBackground(element, imageUrl) {
  const elementToStyle = element;

  elementToStyle.style.background = `url(${imageUrl})`;
  elementToStyle.style['background-repeat'] = 'no-repeat';
  elementToStyle.style['background-size'] = 'cover';
  elementToStyle.style['background-position'] = 'center';
}

function start(label) {
  if (process.env.NODE_ENV !== 'production') {
    console.time(label);
  }
}

function end(label) {
  if (process.env.NODE_ENV !== 'production') {
    console.timeEnd(label);
  }
}
