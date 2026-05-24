const express = require("express");
const {
  createShortUrl,
  listUrls,
  getStats,
  updateShortUrl,
  deleteShortUrl,
} = require("../controllers/urlController");

const router = express.Router();

router.get("/", listUrls);
router.post("/", createShortUrl);
router.get("/:shortCode", getStats);
router.patch("/:shortCode", updateShortUrl);
router.delete("/:shortCode", deleteShortUrl);

module.exports = router;
