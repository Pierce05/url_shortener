const path = require("path");
const QRCode = require("qrcode");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "assets", "live-site-qr.png");
const LIVE_URL = "https://url-shortener-1149.onrender.com";

async function main() {
  await QRCode.toFile(OUT, LIVE_URL, {
    errorCorrectionLevel: "M",
    margin: 1,
    width: 256,
    color: {
      dark: "#050505",
      light: "#F5F0E8",
    },
  });

  console.log(`Wrote ${OUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
