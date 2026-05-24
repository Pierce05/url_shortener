const { nanoid } = require("nanoid");
const Url = require("../models/Url");
const AppError = require("../utils/AppError");

function normalizeUrl(input) {
  try {
    const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    const parsed = new URL(candidate);
    return parsed.toString();
  } catch (_error) {
    throw new AppError("Please enter a valid URL.", 400);
  }
}

async function createUniqueShortCode(requestedCode) {
  if (requestedCode) {
    const existing = await Url.findOne({ shortCode: requestedCode });
    if (existing) {
      throw new AppError("That custom short code is already in use.", 409);
    }
    return requestedCode;
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const shortCode = nanoid(7);
    const exists = await Url.exists({ shortCode });
    if (!exists) {
      return shortCode;
    }
  }

  throw new AppError("Could not generate a unique short code. Please try again.", 500);
}

module.exports = {
  normalizeUrl,
  createUniqueShortCode,
};
