const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    const pythonRes = await fetch("http://localhost:7000/analyze", {
      method: "POST",
      body: req.file.buffer,
      headers: {
        "Content-Type": req.file.mimetype,
      },
    });

    const data = await pythonRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Python model error" });
  }
});

app.listen(5000, () => console.log("Node backend running on port 5000"));
