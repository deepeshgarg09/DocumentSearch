const pdfParser = require("pdf-parse");
const fs = require("fs");

const readPdf = async (pdfFilePath) =>
  new Promise(async (resolve, reject) => {
    fs.readFile(pdfFilePath, async (err, pdfBuffer) => {
      if (err) {
        reject(err);
      } else {
        const pdfText = await pdfParser(pdfBuffer);

        resolve(pdfText.text);
      }
    });
  });

const readTxt = async (txtFilePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(txtFilePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

module.exports = {
  readPdf,
  readTxt,
};
