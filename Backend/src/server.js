const express = require("express");
const cors = require("cors");
const { server } = require("config");
const routes = require("./routes");
const esFactory = require("./services/elasticSearch");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", routes);

app.use((err, req, res, next) => {
  const error = {
    statusCode: err.status || 500,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  };

  res.status(error.statusCode).json(error);
});

app.listen(process.env.PORT || server.get("port"), async () => {
  try {
    const elasticsearch = esFactory();
    elasticsearch
      .ensureIndex()
      .then(() => console.log("Elasticsearch initialized successfully"))
      .catch((err) =>
        console.error("Failed to initialize elasticsearch", {
          error: err,
          message: err.message,
        })
      );
  } catch (err) {
    console.error(`Failed to connect to Elasticsearch\n${err.message}`);
  }
});

module.exports = app;
