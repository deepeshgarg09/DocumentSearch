const express = require("express");
const ElasticSearchService = require("../../services/elasticSearch");

const router = express.Router();

router.get("/search", async ({ query }, res, next) => {
  try {
    console.log("query: ", query);

    if (!query || !query.text) {
      throw new Error("Please provide search text");
    }

    const { parsedFile } = ElasticSearchService();

    const matchingFiles = await parsedFile.search({
      search: query.text,
    });

    res.send({
      statusCode: 200,
      data: matchingFiles.parsedFiles.map((obj) => obj._source),
      message: "Files have been fetched",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
