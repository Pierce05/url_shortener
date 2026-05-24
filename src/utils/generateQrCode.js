const QRCode = require("qrcode");

async function generateQrCode(shortUrl) {
  return QRCode.toDataURL(shortUrl, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 220,
    color: {
      dark: "#1d1b18",
      light: "#fffdf8",
    },
  });
}

module.exports = generateQrCode;
