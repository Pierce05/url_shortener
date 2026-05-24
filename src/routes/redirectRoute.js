const express = require("express");
const { redirectToOriginalUrl } = require("../controllers/urlController");

const router = express.Router();

router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;
