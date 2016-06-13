import 'context-blender';
import StackBlur from 'stackblur';


/**
 * @todo: Add an event listener on the element, not on window
 *
 * @return {promise}
 */
export function background(element, imageSource) {
  return Promise.resolve((resolve) => {
    window.onload = () => {
      const downsizedImageUri = _blur(_downsizeImage(resolveElement(imageSource)));
      return resolve(setBackground(resolveElement(element), downsizedImageUri));
    };
  });
}

function _blur(imageSource, blurRadius) {
  // Temporarily create offscreen image
  const downsizedImage = new Image();
  downsizedImage.src = imageSource;
  downsizedImage.id = 'downsizedImage';
  document.body.appendChild(downsizedImage);

  StackBlur.image('renderedImage', 'canvas', blurRadius);

  // Get the image uri of downsized image
  const bluredImageCanvas = resolveElement('canvas');
  const dataUrl = bluredImageCanvas.toDataURL();
  bluredImageCanvas.remove();

  return dataUrl;
}

/**
 * @todo: requestAnimationFrame support
 * @todo: calculate if image is worth downsizing
 *
 * @param  {string} imgElement        | <img> element
 * @param  {number} dwidth            | image source or image element
 * @param  {number} dheight           | image source or image element
 * @return {string} downsizedImageUri
 */
export function _downsizeImage(imgElement, dwidth = 200, dheight = 200) {
  start('_downsizeImage');

  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = imgElement;

  console.log({ width, height });

  // Downsize
  ctx.drawImage(imgElement, 0, 0, dwidth, dheight);
  const downsizedImageUri = canvas.toDataURL();
  canvas.remove();

  end('_downsizeImage');

  return downsizedImageUri;
}

function resolveElement(element) {
  if (typeof element === 'string') return document.querySelector(element);
  if (element instanceof Node) return element;

  throw new Error('Unexpected image type');
}

function setBackground(element, imageUrl) {
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
