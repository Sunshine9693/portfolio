export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
const fileType = file => file.type || ({ jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' }[file.name.split('.').pop().toLowerCase()] || '');

export function validateUpload(file, imagesOnly = false) {
  if (!file) throw new Error('Choose a file first.');
  if (!imageTypes.includes(fileType(file)) && !(fileType(file) === 'application/pdf' && !imagesOnly)) {
    throw new Error('Choose a JPG, PNG, or WebP photo' + (imagesOnly ? '.' : ', or a PDF document.') + ' For HEIC photos, export as JPG first.');
  }
  if (fileType(file) === 'application/pdf' && file.size > MAX_UPLOAD_BYTES) {
    throw new Error('This PDF is larger than 4 MB. Please compress it before uploading.');
  }
  if (file.size > 30 * 1024 * 1024) throw new Error('This image is larger than 30 MB. Please resize it first.');
}

export async function prepareUpload(file) {
  validateUpload(file);
  if (!file.type) file = new File([file], file.name, { type: fileType(file) });
  if (file.size <= MAX_UPLOAD_BYTES) return file;
  const url = URL.createObjectURL(file);
  const image = new Image();
  try {
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = () => reject(new Error('This photo cannot be read. Please export it as JPG or PNG and choose it again.'));
      image.src = url;
    });
    const scale = Math.min(1, 2400 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob || blob.size > MAX_UPLOAD_BYTES) throw new Error('This photo is still too large. Please choose a smaller image.');
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const uploadErrorMessage = (error) => error.response?.data?.message ||
  (error.response?.status === 413 ? 'The upload is too large. Choose a smaller file.' :
    [502, 503, 504].includes(error.response?.status) || error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK'
      ? 'The upload service is reconnecting. Your file is still selected; please try again shortly.'
      : error.message || 'The file could not be uploaded. Please try again.');
