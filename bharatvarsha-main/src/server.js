const express = require("express");
const cors = require("cors");
require("dotenv").config();

const stateRoutes = require("./routes/state");
const aiRoutes = require("./routes/ai");
const voiceRoutes = require("./routes/voiceroute");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({
    message: "Bharatvarsha Heritage API is running",
    status: "ok",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/states", stateRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/voiceroute", voiceRoutes);

module.exports = app;

// Local development only. Vercel imports the Express app as a serverless function.
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Bharatvarsha API running at http://localhost:${PORT}`);
  });
}
