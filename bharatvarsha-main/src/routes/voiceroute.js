const express = require("express");
const multer = require("multer");
const { voiceChat } = require("../controllers/voicecontroller");

const router = express.Router();

// Vercel's filesystem is temporary. /tmp is writable during a function invocation.
const upload = multer({
  dest: "/tmp/heritage-uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/chat", upload.single("audio"), voiceChat);

module.exports = router;
