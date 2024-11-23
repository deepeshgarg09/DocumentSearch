const express = require("express");
const parseFileRoutes = require("./parseFile");

const router = express.Router();

router.get("/", (_, res) => {
  res.json({ title: "File parse service" });
});

router.use("/parseFile", parseFileRoutes);

module.exports = router;
