import 'context-blender';
import StackBlur from 'stackblur-canvas';
import BackgroundCheck from 'background-check';


// const cache = {};

/**
 * @todo: Add an event listener on the element, not on window
 *
 * @return {promise}
 */
export async function background(element, imageSource, radius = 0) {
  if (!window._image_cache_) {
    window._image_cache_ = _downsizeImage(_resolveElement(imageSource));
  }

  const cachedImage = await window._image_cache_;

  // setTimeout(() => {
  //   _shouldDarken();
  // }, 1000);

  requestAnimationFrame(async () => {
    const downsizedBurredImageUri = await _blur(cachedImage, radius);
    _setBackground(_resolveElement(element), downsizedBurredImageUri);
    return downsizedBurredImageUri;
  });
}

// function _resolveCache() {}

// function _cache(value, ...params) {
//   cache[`${params}`] = value;
// }

function _blur(imageSource, blurRadius) {
  return new Promise(resolve => requestAnimationFrame(() => {
    // Temporarily create offscreen image
    const downsizedImage = new Image();
    downsizedImage.src = imageSource;
    downsizedImage.id = 'downsizedImage';
    document.body.appendChild(downsizedImage);

    StackBlur.image('downsizedImage', 'canvas', blurRadius);

    // Get the image uri of downsized image
    const bluredImageCanvas = _resolveElement('canvas');
    const dataUrl = bluredImageCanvas.toDataURL();
    downsizedImage.remove();

    resolve(dataUrl);
  }));
}

function _shouldDarken(targets = '.glass') {
  BackgroundCheck.init({ targets });
}

/**
 * @todo: requestAnimationFrame support
 * @todo: calculate if image is worth downsizing
 *
 * @param  {string}  imgElement        | <img> element
 * @param  {number}  targetWidth       | image source or image element
 * @param  {number}  targetHeight      | image source or image element
 * @return {promise} downsizedImageUri
 */
export function _downsizeImage(imgElement, targetWidth = 200, targetHeight = 200) {
  start('_downsizeImage');

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const { naturalWidth, naturalHeight } = imgElement;

  console.log(imgElement);

  if (process.env.NODE_ENV !== 'production') {
    console.log('Downsizing from:');
    console.log({ naturalWidth, naturalHeight });
    console.log('to:');
    console.log({ targetWidth, targetHeight });
  }

  // Downsize
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      ctx.drawImage(imgElement, 0, 0, Math.round(targetWidth), Math.round(targetHeight));
      const downsizedImageUri = canvas.toDataURL();

      end('_downsizeImage');

      resolve(downsizedImageUri);
    });
  });
}

function _resolveElement(element) {
  if (typeof element === 'string') return document.querySelector(element);
  if (element instanceof Node) return element;

  throw new Error('Unexpected image type');
}

function _setBackground(element, imageUrl) {
  const elementToStyle = element;

  requestAnimationFrame(() => {
    elementToStyle.style.background = `url(${imageUrl})`;
    elementToStyle.style['background-repeat'] = 'no-repeat';
    elementToStyle.style['background-size'] = 'cover';
    elementToStyle.style['background-position'] = 'center';
  });
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
