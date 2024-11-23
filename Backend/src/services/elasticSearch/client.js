const elasticsearch = require("@elastic/elasticsearch");
const esConfig = require("config").get("elasticsearch");

const client = new elasticsearch.Client({
  node: `https://${process.env.ELASTIC_SEARCH_HOST}:${process.env.ELASTIC_SEARCH_PORT}`,
  auth: {
    username: process.env.ELASTIC_SEARCH_USER_NAME,
    password: process.env.ELASTIC_SEARCH_PASSWORD,
  },
});

module.exports = client;
