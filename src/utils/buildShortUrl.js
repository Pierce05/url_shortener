function buildShortUrl(req, shortCode) {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${baseUrl.replace(/\/$/, "")}/${shortCode}`;
}

module.exports = buildShortUrl;
