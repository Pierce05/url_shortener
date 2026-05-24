const { z } = require("zod");
const Url = require("../models/Url");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const buildShortUrl = require("../utils/buildShortUrl");
const { normalizeUrl, createUniqueShortCode } = require("../services/urlService");

const createUrlSchema = z.object({
  originalUrl: z.string().min(1, "A URL is required."),
  customCode: z
    .string()
    .trim()
    .min(4, "Custom code must be at least 4 characters.")
    .max(32, "Custom code must be at most 32 characters.")
    .regex(/^[a-zA-Z0-9_-]+$/, "Custom code can only use letters, numbers, hyphens, and underscores.")
    .optional()
    .or(z.literal("")),
});

const updateUrlSchema = z.object({
  originalUrl: z.string().min(1, "A URL is required."),
});

function toUrlResponse(req, urlDoc) {
  return {
    id: urlDoc._id,
    originalUrl: urlDoc.originalUrl,
    shortCode: urlDoc.shortCode,
    shortUrl: buildShortUrl(req, urlDoc.shortCode),
    clicks: urlDoc.clicks,
    lastVisitedAt: urlDoc.lastVisitedAt,
    createdAt: urlDoc.createdAt,
    updatedAt: urlDoc.updatedAt,
  };
}

const createShortUrl = asyncHandler(async (req, res) => {
  const parsed = createUrlSchema.parse(req.body);
  const normalizedUrl = normalizeUrl(parsed.originalUrl);
  const requestedCode = parsed.customCode || undefined;

  if (!requestedCode) {
    const existing = await Url.findOne({ normalizedUrl });
    if (existing) {
      return res.status(200).json({
        message: "This URL was already shortened before, so the existing short link was returned.",
        data: toUrlResponse(req, existing),
      });
    }
  }

  const shortCode = await createUniqueShortCode(requestedCode);

  const created = await Url.create({
    originalUrl: parsed.originalUrl.trim(),
    normalizedUrl,
    shortCode,
  });

  res.status(201).json({
    message: "Short URL created successfully.",
    data: toUrlResponse(req, created),
  });
});

const listUrls = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 25, 100);
  const urls = await Url.find().sort({ createdAt: -1 }).limit(limit);

  res.status(200).json({
    count: urls.length,
    data: urls.map((urlDoc) => toUrlResponse(req, urlDoc)),
  });
});

const getStats = asyncHandler(async (req, res) => {
  const urlDoc = await Url.findOne({ shortCode: req.params.shortCode });

  if (!urlDoc) {
    throw new AppError("Short URL not found.", 404);
  }

  res.status(200).json({
    data: toUrlResponse(req, urlDoc),
  });
});

const updateShortUrl = asyncHandler(async (req, res) => {
  const parsed = updateUrlSchema.parse(req.body);
  const normalizedUrl = normalizeUrl(parsed.originalUrl);

  const updated = await Url.findOneAndUpdate(
    { shortCode: req.params.shortCode },
    {
      originalUrl: parsed.originalUrl.trim(),
      normalizedUrl,
    },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw new AppError("Short URL not found.", 404);
  }

  res.status(200).json({
    message: "Short URL updated successfully.",
    data: toUrlResponse(req, updated),
  });
});

const deleteShortUrl = asyncHandler(async (req, res) => {
  const deleted = await Url.findOneAndDelete({ shortCode: req.params.shortCode });

  if (!deleted) {
    throw new AppError("Short URL not found.", 404);
  }

  res.status(204).send();
});

const redirectToOriginalUrl = asyncHandler(async (req, res) => {
  const urlDoc = await Url.findOne({ shortCode: req.params.shortCode });

  if (!urlDoc) {
    throw new AppError("Short URL not found.", 404);
  }

  urlDoc.clicks += 1;
  urlDoc.lastVisitedAt = new Date();
  await urlDoc.save();

  res.redirect(302, urlDoc.normalizedUrl);
});

module.exports = {
  createShortUrl,
  listUrls,
  getStats,
  updateShortUrl,
  deleteShortUrl,
  redirectToOriginalUrl,
};
