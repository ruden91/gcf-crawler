const { Storage } = require("@google-cloud/storage");
const rootPath = require("app-root-path");
const path = require("path");
const os = require("os");
const fs = require("fs");
const dotenv = require("dotenv");
const { getTimestamp, getUpdatedDate, makeJSON } = require(`./index`);

dotenv.config();

class Store {
  constructor() {
    this.BUCKET_NAME = process.env.BUCKET_NAME;
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID,
      keyFilename: `${rootPath}/key.json`
    });
  }

  upload(file, options) {
    const mergedOptions = Object.assign(
      {},
      {
        gzip: true,
        public: true,
        metadata: {
          cacheControl: "public, max-age=600, must-revalidate" // 10 minutes cache
        }
      },
      options
    );
    this.storage.bucket(this.BUCKET_NAME).upload(file, mergedOptions);
  }

  writeFileSync(file, json) {
    fs.writeFileSync(file, JSON.stringify(json));
  }

  getTempFileName(fileName) {
    return path.join(os.tmpdir(), fileName);
  }
}

module.exports = {
  storage: new Store(),
  getTimestamp,
  getUpdatedDate,
  makeJSON
};
