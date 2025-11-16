// utils/qrcode.js
const QRCode = require('qrcode');

/**
 * Generate QR code from payment link
 */
async function generateQRCode(data, options = {}) {
  try {
    const qrOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      width: 300,
      ...options,
    };
    
    const qrCodeDataUrl = await QRCode.toDataURL(data, qrOptions);
    return qrCodeDataUrl;
  } catch (error) {
    console.error('QR Code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
}

/**
 * Generate QR code buffer (for download)
 */
async function generateQRCodeBuffer(data) {
  try {
    const buffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
    });
    return buffer;
  } catch (error) {
    console.error('QR Code buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
}

module.exports = {
  generateQRCode,
  generateQRCodeBuffer,
};
