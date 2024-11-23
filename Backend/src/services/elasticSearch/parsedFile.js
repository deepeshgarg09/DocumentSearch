const EsIndex = require("./esIndex");
const defaultIndex = "parsedfile";

const bucketName = process.env.S3_BUCKET_NAME;

const defaultMapping = {
  text: {
    type: "text",
  },
  updatedAt: {
    type: "date",
  },
  fileName: {
    type: "text",
  },
};

class ParsedFile extends EsIndex {
  constructor({ index = defaultIndex, mappings = defaultMapping, ...args }) {
    super({ ...args, index, mappings });
  }

  async upsert(parsedFileObj) {
    const s3Url = `https://${bucketName}.s3.amazonaws.com/${parsedFileObj.id}`;

    const parsedFile = {
      id: parsedFileObj.id,
      fileName: parsedFileObj.name,
      text: parsedFileObj.text,
      updatedAt: parsedFileObj.updatedAt,
      url: s3Url,
    };

    const response = this.client
      .index({
        index: this.index,
        id: String(parsedFile.id),
        refresh: this.forceRefresh,
        body: parsedFile,
      })
      .catch((err) => {
        throw err;
      });

    return response;
  }

  async delete(parsedFile) {
    const response = await super.delete(parsedFile);

    return response;
  }

  async search(filter, from = 0, size = 1000) {
    const search = filter && filter.search;
    const name = filter && filter.name;

    const query = {
      bool: {
        must: [],
      },
    };

    if (name) {
      query.bool.must.push({
        term: {
          id: name,
        },
      });
    }

    if (search) {
      const searchWords = search
        .trim()
        .toLowerCase()
        .split(/[\.\-_ ]/);

      searchWords.forEach((searchWord) => {
        query.bool.must.push({
          bool: {
            should: [
              {
                wildcard: {
                  text: {
                    value: `*${searchWord.toLowerCase()}*`,
                    boost: 1.0,
                    rewrite: "constant_score",
                  },
                },
              },
              {
                wildcard: {
                  id: {
                    value: `*${searchWord.toLowerCase()}*`,
                    boost: 1.0,
                    rewrite: "constant_score",
                  },
                },
              },
            ],
          },
        });
      });
    }
    console.log(JSON.stringify(query));
    const sort = { updatedAt: "desc" };

    const result = await this.client.search({
      index: this.index,
      body: {
        query,
        sort: [sort],
        from,
        size,
      },
    });
    const parsedFiles = result.hits.hits;

    return {
      total: result.hits.total,
      parsedFiles,
    };
  }
}

module.exports = ParsedFile;
