import {Image} from 'react-native';

export function isValidUrl(url) {
  const pattern = /^((https?:\/\/)|(www\.))([a-z0-9-]+\.?)+(:[0-9]+)?(\/.*)?$/i;
  return pattern.test(url);
}

export function base_url(path) {
  return `https://pizza.ibmhub.nl/${path}`;
}

export function brokenImg(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    setTimeout(() => resolve(false), 5000); // Timeout fallback
  });
}

export async function processFlourImage(f) {
  const defaultImg = base_url('assets/images/wheat-white.png');

  if (f.flour_img && f.flour_img.trim() !== '') {
    if (isValidUrl(f.flour_img)) {
      const isOk = await brokenImg(f.flour_img);
      return isOk ? f.flour_img : defaultImg;
    } else {
      return base_url('uploads/flour') + '/' + f.flour_img;
    }
  }
  return defaultImg;
}

// export const getImageUrl = url => {
//   if (!url) return null;

//   // If the URL doesn't start with 'http' or 'https', add a base path
//   if (!url.startsWith('http')) {
//     // Adjust this to your actual domain or base URL
//     return `https://pizza.ibmhub.nl/uploads/flour/${url}`;
//   }

//   return url;
// };

export const loadImage = async img => {
  const resolvedUrl = await getImageUrl(img || '');
  return resolvedUrl;
};
