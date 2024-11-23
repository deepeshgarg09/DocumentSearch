const express = require("express");
const { listFiles, downloadFile } = require("../../services/cloudStorage");
const { defaultDownloadPath } = require("config");
const { readTxt, readPdf } = require("../../lib/readFiles");
const ElasticSearchService = require("../../services/elasticSearch");
const path = require("path");

const router = express.Router();

const sync = async () => {
  const { parsedFile } = ElasticSearchService();

  const files = await listFiles();

  console.log("files: ", files);

  const newFilePath = path.join(__dirname, defaultDownloadPath);

  for (const file of files) {
    await downloadFile(file.Key, newFilePath);

    let text = "";

    if (file.Key.indexOf(".pdf") > -1) {
      text = await readPdf(`${newFilePath}/${file.Key}`);
    } else if (file.Key.indexOf(".txt") > -1) {
      text = await readTxt(`${newFilePath}/${file.Key}`);
    } else {
      console.error("Unable to parse file type");
    }

    console.log("text: ", text);

    await parsedFile.upsert({
      id: file.Key,
      updatedAt: file.LastModified,
      text,
      fileName: file.Key,
    });
  }
};

router.post("/sync", async ({ requestId }, res, next) => {
  try {
    sync({ requestId });

    res.send({
      statusCode: 200,
      message: "Sync has been initialized",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
