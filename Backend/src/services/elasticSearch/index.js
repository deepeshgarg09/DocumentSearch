const client = require("./client");
const ParseFileIndex = require("./parsedFile");

module.exports = () => {
  const parsedFile = new ParseFileIndex({ client });

  return {
    async ensureIndex() {
      await parsedFile.ensureIndex();
    },
    parsedFile,
  };
};
